import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {AsyncPipe, CommonModule, DatePipe, NgForOf, NgIf} from "@angular/common";
import {DateService} from "../date.service";
import {MomentTransformDatePipe} from "../../../../shared/pipe/moment-transform-date.pipe";
import {ApiService} from "../../../../shared/services/api.service";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {Subject, takeUntil, throwError} from "rxjs";
import {ErrorResponseService} from "../../../../shared/services/error.response.service";
import moment from "moment";

@Component({
  selector: 'app-data-calendar',
  standalone: true,
  imports: [
    DatePipe,
    AsyncPipe,
    MomentTransformDatePipe,
    NgForOf,
    NgIf,
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './data-calendar.component.html',
  styleUrl: './data-calendar.component.css'
})
export class DataCalendarComponent implements OnInit {
  @ViewChild('inputElement') inputElementRef: ElementRef;
  @Input() dayOfWeek: any;
  form = new FormGroup({
    newEntry: new FormControl(null, Validators.required),
  })

  newEntryHasBeenOpened: any;
  currentDay: any = [];
  currentHourF: any  = new Date().getHours();
  currentDate: any;
  currentDayCheck: boolean = false;
  recordsCurrentDay: any = [];
  disabledBtnRecord: boolean = false;
  private destroyed$: Subject<void> = new Subject();
  pastDateIsBlocked: boolean = false;

  constructor(public dateService: DateService,
              public apiService: ApiService,
              private errorResponseService: ErrorResponseService
  ) {
  }

  ngOnInit(): void {
    this.currentDate = moment().format('DD.MM.YYYY');
    this.pastDateIsBlocked = this.currentDate > this.dayOfWeek;
    this.currentDayCheck = this.currentDate === this.dayOfWeek;

    this.dateService.date
      .pipe(takeUntil(this.destroyed$))
      .subscribe(() => {
        this.getAllEntry(this.dayOfWeek)
      })
    this.dateService.timeStartRecord
      .pipe(takeUntil(this.destroyed$))
      .subscribe(() => {
        this.getAllEntry(this.dayOfWeek);
      })
    this.dateService.timeFinishRecord
      .pipe(takeUntil(this.destroyed$))
      .subscribe(() => {
        this.getAllEntry(this.dayOfWeek);
      })
  }


  public localErrHandler(err: string) {
    this.errorResponseService.localHandler(err)
    return throwError(() => err)
  }


  //берем все записи из базы за текущую дату и выбранное время
  getAllEntryInCurrentTimes(dateAndTimeRec: any) {
    this.apiService.getAllEntryInCurrentTimes(dateAndTimeRec)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(allEntryCurTime => {
        //ограничиваем запись если записано указанное кол-во человек
        if (allEntryCurTime.length >= this.dateService.maxPossibleEntries.value) {
          this.cancel();
          this.localErrHandler('На выбранное время запись завершена!' +
            ' Запишитесь пожалуйста на другое время или день!');
          return;
        }
      });
  }


//берем все записи из базы за текущую дату
  getAllEntry(date: any) {
    // this.apiService.getAllEntry(this.dateService.date.value.format('DD.MM.YYYY'))
    this.apiService.getAllEntry(date)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(allEntry => {
        if (allEntry) {
          this.formattingEntry(allEntry)
        }
      });
  }

  //функция форматирующая взятые данные подгон под нужный формат
  formattingEntry(allEntry: any) {
    let resArrayCurrentDay: any = [];
    let allEntryRecord: any[] = [];
    let sortEntry = allEntry.sort((a: any, b: any) => a.time > b.time ? 1 : -1);
    if (sortEntry.length >= 1) {
      // время первой записи
      let time = sortEntry[0].time;
      //пустые данные до времени где есть хоть одна запись
      for (let i = this.dateService.timeStartRecord.value; i < time; i++) {
        resArrayCurrentDay.push(this.filteringRecordsAtDifferentTimes([], JSON.stringify(i)));
      }
      //собираем результирующий массив
      resArrayCurrentDay = [...resArrayCurrentDay, this.filteringRecordsAtDifferentTimes(sortEntry, time)]

      //определяем записи сделаны на одно время или на разные часы, ...
      sortEntry.forEach((t: any) => {
        allEntryRecord.push(t.time)
      })
      // записываем только те часы в которых есть запись
      this.recordsCurrentDay = Array.from(new Set(allEntryRecord));

      //цикл проверяется каждый час и если в нем есть записи то фильтрует его
      for (let i = time; i < this.dateService.timeFinishRecord.value; i++) {
        let timeInFor = JSON.stringify(+i + 1)
        if (this.recordsCurrentDay.includes(timeInFor)) {   //...чтоб проверять в каждом след часе есть запись или нет
          this.filteringRecordsAtDifferentTimes(sortEntry, timeInFor)
          resArrayCurrentDay = [...resArrayCurrentDay, this.filteringRecordsAtDifferentTimes(sortEntry, timeInFor)]
        } else {
          resArrayCurrentDay = [...resArrayCurrentDay, this.filteringRecordsAtDifferentTimes([], timeInFor)]
        }
      }
      this.currentDay = resArrayCurrentDay;
    } else {
      //если нет записей просто проставляем часы
      this.currentDay = []           //<-- чтоб пустое время не дублировалось обнуляем массив
      for (let i = this.dateService.timeStartRecord.value; i <= this.dateService.timeFinishRecord.value; i++) {
        this.currentDay.push(this.filteringRecordsAtDifferentTimes([], JSON.stringify(i)))
      }
    }
  }

  //функция фильтрующая данные о том кто записан на конкретный час
  filteringRecordsAtDifferentTimes(sortEntry: any, time: any) {
    if (sortEntry) {
      let rec = sortEntry.filter((el: any) => {
        return el.time === time;
      })
      return {time, users: rec};
    } else {
      return {time, users: []};
    }
  }


  //функция добавления новой записи
  addEntry(user: any, currentHourTime: any) {
    const newUserAccount = {
      // date: this.dateService.date.value.format('DD.MM.YYYY'),
      date: this.dayOfWeek,
      time: currentHourTime,
      user: user.surnameUser + ' ' + user.nameUser,
      userId: user.id,
      remainingFunds: user.remainingFunds
    }
    this.apiService.addEntry(newUserAccount)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(() => {
        this.getAllEntry(this.dayOfWeek);
      })
  }

  deletePerson(id: any, userId: any) {
    this.apiService.deleteEntry(id, userId)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(() => {
        this.getAllEntry(this.dayOfWeek);
        let user = this.dateService.allUsers.value.find((el: any) => {
          return el.id === +userId
        })
        user.remainingFunds = JSON.stringify(+user.remainingFunds + 1);
        if (user.id === this.dateService.currentUserId.value) {
          this.dateService.remainingFunds.next(JSON.stringify(+this.dateService.remainingFunds.value + 1));
        }
      })
  }

  //функция записывающая пользователя на выбранное время по нажатию enter
  savingByPressingEnter (e: any, val: any) {
    if (val && e.code === 'Enter'){
      this.submit();
    }
    if (e.code === 'Escape') {
      this.cancel()
    }
  }

  cancel() {
    this.newEntryHasBeenOpened = '';
  }

  setValueForRec(inputValue: any) {
    if (inputValue) {
      this.disabledBtnRecord = false;
    }
  }

  checkingTheNumberOfRecorded(timeRec: any) {
    const dateRec = this.dayOfWeek;
    const dateAndTimeRec = {
      timeRec: timeRec,
      dateRec: dateRec
    }
    this.getAllEntryInCurrentTimes(dateAndTimeRec);
  }

  currentHourTime(time: any) {
    this.checkingTheNumberOfRecorded(time);
    setTimeout(() => {
      this.inputElementRef?.nativeElement?.focus();
      this.disabledBtnRecord = !this.inputElementRef?.nativeElement?.value
    }, 100)
    this.newEntryHasBeenOpened = time;
  }

  submit() {
    let dataInput = this.form.value.newEntry as any
    let id = dataInput.split(',')[0];
    let time = dataInput.split(',')[1];
    let user = this.dateService.allUsers.value.find((el: any) => {
      return el.id === +id
    })
    user.remainingFunds = JSON.stringify(+user.remainingFunds - 1);
    if (user.id === this.dateService.currentUserId.value) {
      this.dateService.remainingFunds.next(user.remainingFunds);
    }
    this.addEntry(user, time);
    this.cancel();
  }

}
