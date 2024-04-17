import { Injectable } from '@angular/core';
import {BehaviorSubject, Subject, takeUntil} from "rxjs";
import {ApiService} from "../../../../shared/services/api.service";
import {DateService} from "../date.service";

@Injectable({
  providedIn: 'root'
})
export class DataCalendarService {
  private destroyed$: Subject<void> = new Subject();

  constructor(
              public apiService: ApiService,
              public dateService: DateService,
  ) {}

  public filterAllUserForCurrentOrg: BehaviorSubject<any> = new BehaviorSubject([])
  public allEntryAllUsersInMonth: BehaviorSubject<any> = new BehaviorSubject([])
  public arrayOfDays: BehaviorSubject<any> = new BehaviorSubject([])


  public currentDay: BehaviorSubject<any> = new BehaviorSubject([])
  recordsCurrentDay: any = [];


//функция должна 1 раз взять все записи конкретной организации за текущий месяц и вернуть клиенту
  getAllEntryAllUsersForTheMonth() {
    let selectOrg;
    const selectMonth = this.dateService.date.value.format('MM')
    const selectYear = this.dateService.date.value.format('YYYY')
    if (this.dateService.currentUserIsTheMainAdmin.value) {
        selectOrg = this.dateService.selectedSectionOrOrganization.value
      } else {
        selectOrg = this.dateService.sectionOrOrganization.value
      }
    const dataForGetAllEntryAllUsersSelectedMonth = {
      org: selectOrg,
      month: selectMonth,
      year: selectYear,
    }
    this.apiService.getAllEntryAllUsersOrg(dataForGetAllEntryAllUsersSelectedMonth)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(allEntryAllUsersInMonth => {
        this.allEntryAllUsersInMonth.next(allEntryAllUsersInMonth);
      });
  }



  //берем все записи из базы за текущую дату и фильтруем в зависимости от выбранной организации
  // getAllEntry(date: any) {
    // const filterAllCurrentEntry = this.allEntryAllUsersInMonth.value.filter((el: any)=> {
    //        return  el.date === date
    //       })
    // // console.log('51 date', date)
    // this.formattingEntry(filterAllCurrentEntry)



      //   if (allEntry) {
      //     if (this.dateService.currentUserIsTheMainAdmin.value) {
      //       //если главный админ, то фильтруем в зависимости от выбранной организации
      //       this.filteringDependingOnTheSelectedOrganization(allEntry);
      //     } else {
      //       this.dateService.allUsersSelectedOrg.next(this.dateService.allUsers.value)
      //
      //       const filterAll = allEntry.filter((el: any) => {
      //         return el.sectionOrOrganization === this.dateService.sectionOrOrganization.value
      //       })
      //       this.filterAllUserForCurrentOrg.next(filterAll)
      //       this.formattingEntry(this.filterAllUserForCurrentOrg.value)
      //     }
      //   }
      // });
  // }


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
        const filterAll = allEntry.filter((el: any) => {
          return el.sectionOrOrganization === this.dateService.selectedSectionOrOrganization.value
        })
        this.filterAllUserForCurrentOrg.next(filterAll)
        // this.formattingEntry(this.filterAllUserForCurrentOrg.value)
      })
  }


  // //функция форматирующая взятые данные подгон под нужный формат
  // formattingEntry(allEntry: any) {
  //   let resArrayCurrentDay: any = [];
  //   let allEntryRecord: any[] = [];
  //   let sortEntry = allEntry.sort((a: any, b: any) => a.time > b.time ? 1 : -1);
  //   if (sortEntry.length >= 1) {
  //     // время первой записи
  //     let time = sortEntry[0].time;
  //     //пустые данные до времени где есть хоть одна запись
  //     for (let i = this.dateService.timeStartRecord.value; i < time; i++) {
  //       resArrayCurrentDay.push(this.filteringRecordsAtDifferentTimes([], JSON.stringify(i)));
  //     }
  //     //собираем результирующий массив
  //     resArrayCurrentDay = [...resArrayCurrentDay, this.filteringRecordsAtDifferentTimes(sortEntry, time)]
  //
  //     //определяем записи сделаны на одно время или на разные часы, ...
  //     sortEntry.forEach((t: any) => {
  //       allEntryRecord.push(t.time)
  //     })
  //     // записываем только те часы в которых есть запись
  //     this.recordsCurrentDay = Array.from(new Set(allEntryRecord));
  //
  //     //цикл проверяется каждый час и если в нем есть записи то фильтрует его
  //     for (let i = time; i < this.dateService.timeFinishRecord.value; i++) {
  //       let timeInFor = JSON.stringify(+i + 1)
  //       if (this.recordsCurrentDay.includes(timeInFor)) {   //...чтоб проверять в каждом след часе есть запись или нет
  //         this.filteringRecordsAtDifferentTimes(sortEntry, timeInFor)
  //         resArrayCurrentDay = [...resArrayCurrentDay, this.filteringRecordsAtDifferentTimes(sortEntry, timeInFor)]
  //       } else {
  //         resArrayCurrentDay = [...resArrayCurrentDay, this.filteringRecordsAtDifferentTimes([], timeInFor)]
  //       }
  //     }
  //     this.currentDay.next(resArrayCurrentDay);
  //   } else {
  //     //если нет записей просто проставляем часы
  //     this.currentDay.next([])           //<-- чтоб пустое время не дублировалось обнуляем массив
  //     for (let i = this.dateService.timeStartRecord.value; i <= this.dateService.timeFinishRecord.value; i++) {
  //       this.currentDay.value.push(this.filteringRecordsAtDifferentTimes([], JSON.stringify(i)))
  //     }
  //   }
  // }
  //
  // //функция фильтрующая данные о том кто записан на конкретный час
  // filteringRecordsAtDifferentTimes(sortEntry: any, time: any) {
  //   if (sortEntry) {
  //     let rec = sortEntry.filter((el: any) => {
  //       return el.time === time;
  //     })
  //     return {time, users: rec};
  //   } else {
  //     return {time, users: []};
  //   }
  // }



}
