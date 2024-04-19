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

  public allEntryAllUsersInMonth: BehaviorSubject<any> = new BehaviorSubject([])
  public arrayOfDays: BehaviorSubject<any> = new BehaviorSubject([])



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



  //удаление записи ...в блоке всех записей ...
  deleteSelectedRecInAllRecBlock(selectedRec: any) {
    this.apiService.deleteEntry(selectedRec.id, selectedRec.userId)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(() => {
        this.dateService.remainingFunds.next(JSON.stringify(+this.dateService.remainingFunds.value + 1))
        this.dateService.recordingDaysChanged.next(true);
        const newAllUsers: any[] = []
        this.dateService.allUsersSelectedOrg.value.forEach((el: any) => {
           if ((el: any) => el.id === this.dateService.currentUserId.value) {
              el.remainingFunds = this.dateService.remainingFunds.value
           }
              newAllUsers.push(el)
        })
        this.dateService.allUsersSelectedOrg.next(newAllUsers)
        this.dateService.blockRecIfRecorded.next(false);
        this.getAllEntryAllUsersForTheMonth();
      })
  }



}
