import {Component, OnInit} from '@angular/core';
import {DateService} from "../calendar-components/date.service";
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";
import {Subject, takeUntil} from "rxjs";
import {ApiService} from "../../../shared/services/api.service";
import {ModalService} from "../../../shared/services/modal.service";
import {TranslateMonthPipe} from "../../../shared/pipe/translate-month.pipe";
import {RecordsBlockComponent} from "../calendar-components/current-user-data/records-block/records-block.component";
import {DataCalendarService} from "../calendar-components/data-calendar-new/data-calendar.service";
import moment from "moment";

@Component({
  selector: 'app-data-person-modal',
  standalone: true,
  imports: [
    NgIf,
    AsyncPipe,
    TranslateMonthPipe,
    RecordsBlockComponent,
    NgForOf
  ],
  templateUrl: './data-person-modal.component.html',
  styleUrl: './data-person-modal.component.css'
})
export class DataPersonModalComponent implements OnInit {
  constructor(
    public dateService: DateService,
    public dataCalendarService: DataCalendarService,
    public modalService: ModalService,
    public apiService: ApiService,
  ) {
  }

  nameUser = 'Имя'
  roleUser = 'Роль'
  remainingFunds = 'Остаток средств'
  sectionOrOrganization = 'Секция || Организация'
  showBtnUser: boolean;
  showBtnAdmin: boolean;
  showBtnAdminAndUser: boolean;
  hideBtnForCurrentAdmin: boolean;
  private destroyed$: Subject<void> = new Subject();
  currentDate: any;
  currentHour: any = new Date().getHours();
  blockRepeat: boolean = false;
  clickCount = 0;
  blockRecordsSelectedUser = true;
  selectedUser = this.dateService.dataSelectedUser.value;


  ngOnInit(): void {
    this.dataCalendarService.getAllEntryAllUsersForTheMonth();
    this.dataCalendarService.getAllUsersCurrentOrganization();
    this.selectedUser = this.dateService.allUsersSelectedOrg.value.find((us:any)=> us.id === this.dateService.dataSelectedUser.value.userId)
    this.hideBtnForCurrentAdmin = this.selectedUser.userId == this.dateService.currentUserId.value;
    this.roleUser = this.selectedUser.role;
    this.currentDate = moment().format('DD.MM.YYYY');
    this.dataAboutSelectedUser();
    this.dataCalendarService.allEntryAllUsersInMonth
      .pipe(takeUntil(this.destroyed$))
      .subscribe(()=> {
        this.getAllEntrySelectedUser();
      })
  }

  getAllEntrySelectedUser() {
    const allEntrySelectedUser = this.dataCalendarService.allEntryAllUsersInMonth.value
      .filter((entry: any)=>
           this.selectedUser.userId? entry.userId == this.selectedUser.userId : entry.userId == this.selectedUser.id);
    this.dateService.allEntrySelectedUserInSelectMonth.next(allEntrySelectedUser);
  }


  dataAboutSelectedUser() {
    const selectedUser = this.selectedUser;
    this.selectedUser = this.dateService.allUsersSelectedOrg.value.find((el: any) =>
      selectedUser.userId? el.id == selectedUser.userId: el.id == selectedUser.id)
    this.roleUser = this.selectedUser.role === "USER"? 'Клиент' : this.selectedUser.role;
    // this.roleUser = dataSelectedUser.role === 'MAIN_ADMIN'? 'Boos' : dataSelectedUser.role;
    // this.showBtnAdminAndUser = dataSelectedUser.role === 'MAIN_ADMIN';
    if (this.showBtnAdminAndUser) {
      this.showBtnAdmin = this.showBtnUser = false;
    } else {
        this.showBtnAdmin = this.roleUser === 'Клиент';
        this.showBtnUser = this.roleUser !== 'Клиент';
    }
    this.nameUser = selectedUser.nameUser.split(' ').length === 2?
      selectedUser.nameUser : selectedUser.surnameUser + ' ' + selectedUser.nameUser;
    this.sectionOrOrganization = this.selectedUser.sectionOrOrganization;
    this.remainingFunds = this.selectedUser.remainingFunds;
    this.hideBtnForCurrentAdmin = this.selectedUser.id == this.dateService.currentUserId.value;
  }

  changeRole() {
    const selectedUser = this.selectedUser;
    this.apiService.changeRoleSelectedUser(selectedUser.id, selectedUser.idOrg)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(newRoleUser => {
        const newAllUser:any[] = [];
        this.dateService.allUsersSelectedOrg.value.forEach((el: any)=> {
          if (el.id === +selectedUser.userId) {
            el.role = newRoleUser;
          }
           newAllUser.push(el);
        })
        this.dateService.allUsersSelectedOrg.next(newAllUser)
        this.roleUser = newRoleUser
        this.showBtnAdmin = newRoleUser === 'USER';
        this.showBtnUser = newRoleUser !== 'USER';
      });
  }

  deleteSelectedRecSelectedUser(selectedRec: any) {
    this.clickCount++;
    this.blockRepeat = true;
    setTimeout(() => {
      if (this.clickCount === 1) {
        this.dataCalendarService.deleteSelectedRecInAllRecBlock(selectedRec);
        this.dateService.userCancelHimselfRec.next(0);
        setTimeout(()=>{this.dataAboutSelectedUser()}, 50)
        this.dataAboutSelectedUser();
      } else if (this.clickCount === 2) {
        return
      }
      this.clickCount = 0;
      this.blockRepeat = false;
    }, 250)
  }


  showOrHideDaysRec() {
    this.blockRecordsSelectedUser = !this.blockRecordsSelectedUser;
  }
}
