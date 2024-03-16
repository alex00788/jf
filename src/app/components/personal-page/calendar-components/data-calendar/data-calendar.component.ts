import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {AsyncPipe, CommonModule, DatePipe, NgForOf, NgIf} from "@angular/common";
import {DateService} from "../date.service";
import {MomentTransformDatePipe} from "../../../../shared/pipe/moment-transform-date.pipe";
import {ApiService} from "../../../../shared/services/api.service";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {Subject, takeUntil} from "rxjs";

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
  recordsCurrentDay: any = [];
  timeStartRecord: any = 18;
  timeFinishRecord: any = 20;
  disabledBtnRecord: boolean = false;
  allUsers: any = [];
  private destroyed$: Subject<void> = new Subject();

  constructor(public dateService: DateService,
              public apiService: ApiService,
  ) {
  }

  ngOnInit(): void {
    this.dateService.date
      .pipe(takeUntil(this.destroyed$))
      .subscribe(() => {
        this.getAllEntry(this.dayOfWeek)
      })
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
      for (let i = this.timeStartRecord; i < time; i++) {
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
      for (let i = time; i < this.timeFinishRecord; i++) {
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
      for (let i = this.timeStartRecord; i <= this.timeFinishRecord; i++) {
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
        this.dateService.remainingFunds.next(JSON.stringify(+this.dateService.remainingFunds.value + 1));
      })
  }


  cancel() {
    this.newEntryHasBeenOpened = '';
  }

  setValueForRec(inputValue: any) {
    if (inputValue) {
      this.disabledBtnRecord = false;
    }
  }

  currentHourTime(time: any) {
    setTimeout(() => {
      this.inputElementRef.nativeElement.focus();
      this.disabledBtnRecord = !this.inputElementRef.nativeElement.value
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
    this.dateService.remainingFunds.next(user.remainingFunds);
    this.addEntry(user, time);
    this.cancel();
  }

}
