import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {AsyncPipe, CommonModule, DatePipe, NgForOf, NgIf} from "@angular/common";
import {DateService} from "../date.service";
import {MomentTransformDatePipe} from "../../../../shared/pipe/moment-transform-date.pipe";
import {ApiService} from "../../../../shared/services/api.service";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {Subject, takeUntil, throwError} from "rxjs";
import {ErrorResponseService} from "../../../../shared/services/error.response.service";
import moment from "moment";
import {ModalService} from "../../../../shared/services/modal.service";

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
  currentHourF: any = new Date().getHours();
  currentDate: any;
  currentDayCheck: boolean = false;
  recordsCurrentDay: any = [];
  blockIfRecorded = false;
  disabledBtnRecord: boolean = false;
  private destroyed$: Subject<void> = new Subject();
  pastDateIsBlocked: boolean = false;
  filterAllUserForCurrentOrg: any[] = [];
  clickCount = 0;
  constructor(public dateService: DateService,
              public apiService: ApiService,
              public modalService: ModalService,
              private errorResponseService: ErrorResponseService
  ) {
  }

  ngOnInit(): void {
    this.currentDate = moment().format('DD.MM.YYYY');
    this.pastDateIsBlocked = this.currentDate > this.dayOfWeek;
    this.currentDayCheck = this.currentDate === this.dayOfWeek;

    this.dateService.blockRecIfRecorded
      .pipe(takeUntil(this.destroyed$))
      .subscribe(() => {
        this.blockIfRecorded = false;
      })

    this.dateService.recordingDaysChanged
      .pipe(takeUntil(this.destroyed$))
      .subscribe(() => {
        console.log('60')
        this.getAllEntry(this.dayOfWeek);
    })

    this.dateService.date
      .pipe(takeUntil(this.destroyed$))
      .subscribe(() => {
        console.log('68')
        this.getAllEntry(this.dayOfWeek)
      })
    this.dateService.timeStartRecord
      .pipe(takeUntil(this.destroyed$))
      .subscribe(() => {
        console.log('75')
        this.getAllEntry(this.dayOfWeek);
      })
    this.dateService.timeFinishRecord
      .pipe(takeUntil(this.destroyed$))
      .subscribe(() => {
        console.log('82')
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
        const currentOrg = this.dateService.currentUserIsTheMainAdmin.value ?
          this.dateService.selectedSectionOrOrganization.value : this.dateService.sectionOrOrganization.value;
        const filterOnSelectOrg = allEntryCurTime.filter((el: any) => {
          return el.sectionOrOrganization === currentOrg
        })
        //ограничиваем запись если записано указанное кол-во человек  this.dateService.maxPossibleEntries.value
        if (filterOnSelectOrg.length >= this.dateService.maxPossibleEntries.value) {
          this.cancel();
          this.localErrHandler('На выбранное время запись завершена!' +
            ' Запишитесь пожалуйста на другое время или день!');
          return;
        }
      });
  }

  filteringDependingOnTheSelectedOrganization(allEntry: any) {
    this.dateService.selectedSectionOrOrganization     //подписываемся на смену организации
      .pipe(takeUntil(this.destroyed$))
      .subscribe(() => {
        //фильтрация, чтоб записывать можно было тока пользователей выбранной организации
        const filterUsersOnSelectedOrg = this.dateService.allUsers.value
          .filter((el: any) =>
            el.sectionOrOrganization === this.dateService.selectedSectionOrOrganization.value
          )
        this.dateService.allUsersSelectedOrg.next(filterUsersOnSelectedOrg)

        //фильтрация для показа записанных выбранной орг в календаре
        this.filterAllUserForCurrentOrg = allEntry.filter((el: any) => {
          return el.sectionOrOrganization === this.dateService.selectedSectionOrOrganization.value
        })
        this.formattingEntry(this.filterAllUserForCurrentOrg)
      })
  }

//берем все записи из базы за текущую дату и фильтруем в зависимости от выбранной организации
  getAllEntry(date: any) {
    console.log('как тут оптимизировать повторение запросо при выборе недели 130!!!')
    this.apiService.getAllEntry(date)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(allEntry => {
        if (allEntry) {
          if (this.dateService.currentUserIsTheMainAdmin.value) {
            //если главный админ, то фильтруем в зависимости от выбранной организации
            this.filteringDependingOnTheSelectedOrganization(allEntry);
          } else {
            this.dateService.allUsersSelectedOrg.next(this.dateService.allUsers.value)

            this.filterAllUserForCurrentOrg = allEntry.filter((el: any) => {
              return el.sectionOrOrganization === this.dateService.sectionOrOrganization.value
            })
            this.formattingEntry(this.filterAllUserForCurrentOrg)
          }
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
    const year = this.dayOfWeek.substring(this.dayOfWeek.length - 4);
    const month = this.dayOfWeek.substring(3,5);
    this.dateService.dataSelectedUser.next(user);
    const newUserAccount = {
      date: this.dayOfWeek,
      dateYear: year,
      dateMonth: month,
      time: currentHourTime,
      user: user.surnameUser + ' ' + user.nameUser,
      userId: user.id,
      remainingFunds: user.remainingFunds,
      sectionOrOrganization: user.sectionOrOrganization
    }
    this.apiService.addEntry(newUserAccount)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(() => {
        this.getAllEntry(this.dayOfWeek);
        this.dateService.recordingDaysChanged.next(true);
      })
  }

  deletePerson(id: any, userId: any) {
    if (this.dateService.currentUserSimpleUser.value) {
      // this.dateService.blockRecIfRecorded.next(false);
      this.blockIfRecorded = false;
    }
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
        this.dateService.recordingDaysChanged.next(true);
      })
  }

  //функция записывающая пользователя на выбранное время по нажатию enter
  savingByPressingEnter(e: any, val: any) {
    if (val && e.code === 'Enter') {
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

  //определение кликнули один или два раза чтоб обычн пользователь не кликнул дважды
  currentUserRec(time: any) {
    // this.dateService.blockRecIfRecorded.next(true);
    this.blockIfRecorded = true;
    this.clickCount++;
    setTimeout(() => {
      if (this.clickCount === 1) {
        const currentUser = this.dateService.allUsers.value.find((el: any) => el.id === this.dateService.currentUserId.value)
        currentUser.remainingFunds = JSON.stringify(+currentUser.remainingFunds - 1)
        this.dateService.remainingFunds.next(currentUser.remainingFunds);
        this.addEntry(currentUser, time);
      } else if (this.clickCount === 2) {
        return
      }
      this.clickCount = 0;
    }, 250)

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

  openDataPerson(person: any) {
    this.modalService.open();
    this.dateService.dataSelectedUser.next(person);
  }

  lostFocus() {
    setTimeout(() => {
      this.cancel();
    }, 300)
  }
}
