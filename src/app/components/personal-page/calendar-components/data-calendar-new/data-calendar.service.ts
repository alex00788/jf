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




}
