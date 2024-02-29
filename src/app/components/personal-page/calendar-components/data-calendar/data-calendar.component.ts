import {Component, ContentChildren, ElementRef, OnDestroy, OnInit} from '@angular/core';
import {AsyncPipe, CommonModule, DatePipe, NgForOf, NgIf} from "@angular/common";
import {DateService} from "../date.service";
import {MomentTransformDatePipe} from "../../../../shared/pipe/moment-transform-date.pipe";
import {ApiService} from "../../../../shared/services/api.service";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";

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
export class DataCalendarComponent implements OnInit, OnDestroy {
  @ContentChildren('formNewEntry', {read: ElementRef})
  form = new FormGroup({
    newEntry: new FormControl(null, Validators.required),
  })

  newEntryHasBeenOpened: any;
  hours: any = new Date().getHours();
  min: any = new Date().getMinutes();
  sec: any = new Date().getSeconds();
  subInterval: any;
  currentDay: any = [];
  recordsCurrentDay: any = [];
  timeStartRecord: any = 12;

  constructor(public dateService: DateService,
              public apiService: ApiService,
  ) {
  }

  ngOnInit(): void {
    this.watchOnPage();
    this.dateService.getCurrentUser();
    this.getAllEntry();
    this.dateService.date.subscribe(() => {
      this.getAllEntry()
    })
  }


//часы показывающие текущее время
  watchOnPage() {
    this.subInterval = setInterval(() => {
      this.hours = new Date().getHours();
      this.min = new Date().getMinutes();
      this.sec = new Date().getSeconds();
      this.hours = this.hours > 9 ? this.hours : "0" + this.hours;
      this.min = this.min > 9 ? this.min : "0" + this.min;
      this.sec = this.sec > 9 ? this.sec : "0" + this.sec;
    }, 1000);
  }

//берем все записи из базы за текущую дату
  getAllEntry() {
    this.apiService.getAllEntry(this.dateService.date.value.format('DD.MM.YYYY'))
      .subscribe(allEntry => {
        if (allEntry) {
          this.formattingEntry(allEntry)
          console.log(`берем данные из базы за ${this.dateService.date.value.format('DD.MM.YYYY')}`, allEntry)
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
      for (let i = time; i < 24; i++) {
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
      for (let i = this.timeStartRecord; i <= 23; i++) {
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
  addEntry(inputVal: any, currentHourTime: any) {
    const newUserAccount = {
      date: this.dateService.date.value.format('DD.MM.YYYY'),
      time: currentHourTime,
      user: inputVal,
      remainingFunds: this.dateService.remainingFunds.value
    }
    this.apiService.addEntry(newUserAccount)
      .subscribe(() => {
        this.getAllEntry();
      })
  }

  deletePerson(id: any) {
    this.apiService.deleteEntry(id)
      .subscribe(() => {
        this.getAllEntry();
      })
  }


  cancel() {
    this.newEntryHasBeenOpened = '';
  }

  currentHourTime(time: any) {
    this.newEntryHasBeenOpened = time;
  }

  getInputElementVal(value: any, currentHourTime: any) {
    this.addEntry(value, currentHourTime);
    this.cancel();
  }


  ngOnDestroy(): void {
    clearInterval(this.subInterval);
  }
}
