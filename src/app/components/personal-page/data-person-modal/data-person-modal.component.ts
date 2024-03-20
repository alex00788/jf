import {Component, OnInit} from '@angular/core';
import {DateService} from "../calendar-components/date.service";

@Component({
  selector: 'app-data-person-modal',
  standalone: true,
  imports: [],
  templateUrl: './data-person-modal.component.html',
  styleUrl: './data-person-modal.component.css'
})
export class DataPersonModalComponent implements OnInit{
  constructor(public dateService: DateService,) {
  }

  nameUser = 'Имя'
  roleUser = 'Роль'
  remainingFunds = 'Остаток средств'

  ngOnInit(): void {
    this.dataAboutSelectedUser();
  }

  dataAboutSelectedUser() {
    const selectedUser = this.dateService.dataSelectedUser.value
    const dataSelectedUser = this.dateService.allUsers.value.find((el:any)=> {
      return el.id === +selectedUser.userId;
    })
    this.nameUser = selectedUser.nameUser;
    this.roleUser = dataSelectedUser.role;
    this.remainingFunds = dataSelectedUser.remainingFunds;
  }
}
