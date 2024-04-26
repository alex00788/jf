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
  public allEntryCurrentUserThisMonth: BehaviorSubject<any> = new BehaviorSubject([])
  public arrayOfDays: BehaviorSubject<any> = new BehaviorSubject([])



//функция должна 1 раз взять все записи конкретной организации за текущий месяц и вернуть клиенту
  getAllEntryAllUsersForTheMonth() {
    const dataForGetAllEntryAllUsersSelectedMonth = {
      org: this.dateService.currentOrg.value,
      orgId: this.dateService.idSelectedOrg.value,
      month: this.dateService.date.value.format('MM'),
      year: this.dateService.date.value.format('YYYY'),
      userId: this.dateService.currentUserId.value,
    }
    this.apiService.getAllEntryAllUsersOrg(dataForGetAllEntryAllUsersSelectedMonth)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(allEntryAllUsersInMonth => {
        console.log('38 все записи ORG', allEntryAllUsersInMonth)
        this.allEntryAllUsersInMonth.next(allEntryAllUsersInMonth);
      });
  }


  //получаем всех пользователей выбранной организации
  getAllUsersCurrentOrganization() {
    this.apiService.getAllUsersCurrentOrganization(this.dateService.idSelectedOrg.value)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(allUsersOrganization => {
        const dataCurrentUserAboutSelectedOrg = allUsersOrganization.find((user: any)=> +user.id == this.dateService.currentUserId.value)
        this.dateService.allUsersSelectedOrg.next(allUsersOrganization);
        this.dateService.remainingFunds.next(dataCurrentUserAboutSelectedOrg.remainingFunds);
        this.dateService.currentUserRole.next(dataCurrentUserAboutSelectedOrg.role);
        console.log('49  пользователи выбранной организации', allUsersOrganization)
      });
  }


  // 1 раз берем все записи текущего пользователя во всех организациях!
  getAllEntryCurrentUsersThisMonth() {
    const dataForGetAllEntryCurrentUsersThisMonth = {
      year: this.dateService.date.value.format('YYYY'),
      month: this.dateService.date.value.format('MM'),
      userId: this.dateService.currentUserId.value,
    }
    this.apiService.getAllEntryCurrentUser(dataForGetAllEntryCurrentUsersThisMonth)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(dataAllEntryCurrentUsersThisMonth => {
        console.log('70 все записи USER', dataAllEntryCurrentUsersThisMonth)
        this.allEntryCurrentUserThisMonth.next(dataAllEntryCurrentUsersThisMonth);
      });
  }



  //удаление записи ...в блоке всех записей ...
  deleteSelectedRecInAllRecBlock(selectedRec: any) {
    this.apiService.deleteEntry(selectedRec.idRec, selectedRec.userId, selectedRec.orgId)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(() => {
        this.getAllEntryAllUsersForTheMonth();
        this.getAllUsersCurrentOrganization();
        this.dateService.recordingDaysChanged.next(true);
      })
  }



}
