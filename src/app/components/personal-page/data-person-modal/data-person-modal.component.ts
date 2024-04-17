import {Component, OnInit} from '@angular/core';
import {DateService} from "../calendar-components/date.service";
import {AsyncPipe, NgIf} from "@angular/common";
import {Subject, takeUntil} from "rxjs";
import {ApiService} from "../../../shared/services/api.service";
import {ModalService} from "../../../shared/services/modal.service";

@Component({
  selector: 'app-data-person-modal',
  standalone: true,
  imports: [
    NgIf,
    AsyncPipe
  ],
  templateUrl: './data-person-modal.component.html',
  styleUrl: './data-person-modal.component.css'
})
export class DataPersonModalComponent implements OnInit {
  constructor(
    public dateService: DateService,
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
  private destroyed$: Subject<void> = new Subject();


  ngOnInit(): void {
    this.dataAboutSelectedUser();
  }

  dataAboutSelectedUser() {
    const selectedUser = this.dateService.dataSelectedUser.value
    const dataSelectedUser = this.dateService.allUsers.value.find((el: any) => el.id === +selectedUser.userId)
    this.roleUser = dataSelectedUser.role === 'MAIN_ADMIN'? 'Boos' : dataSelectedUser.role;
    this.showBtnAdminAndUser = dataSelectedUser.role === 'MAIN_ADMIN';
    if (this.showBtnAdminAndUser) {
      this.showBtnAdmin = this.showBtnUser = false;
    } else {
        this.showBtnAdmin = this.roleUser === 'USER';
        this.showBtnUser = this.roleUser !== 'USER';
    }
    this.nameUser = selectedUser.nameUser;
    this.sectionOrOrganization = dataSelectedUser.sectionOrOrganization;
    this.remainingFunds = dataSelectedUser.remainingFunds;
  }

  changeRole() {
    const selectedUser = this.dateService.dataSelectedUser.value
    this.apiService.changeRoleSelectedUser(selectedUser.userId)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(newRoleUser => {
        //обновить главную страницу когда админ сам себя назначил юзером
        // this.dateService.currentUserRole.next(newRoleUser)
        // const currentUser = JSON.parse(localStorage.getItem('userData') as string)
        // currentUser.user.role = newRoleUser;
        // localStorage.setItem('userData', JSON.stringify(currentUser))
        const newAllUser:any[] = [];
        const selectedUser = this.dateService.dataSelectedUser.value
        // const dataSelectedUser = this.dateService.allUsers.value.find((el: any) => el.id === +selectedUser.userId)
        this.dateService.allUsers.value.forEach((el: any)=> {
          if (el.id === +selectedUser.userId) {
            el.role = newRoleUser;
          }
           newAllUser.push(el);
        })
        this.dateService.allUsers.next(newAllUser)
        this.roleUser = newRoleUser
          this.showBtnAdmin = newRoleUser === 'USER';
          this.showBtnUser = newRoleUser !== 'USER';
      });
  }
}
