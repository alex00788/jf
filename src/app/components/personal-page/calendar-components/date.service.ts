import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";
import moment from "moment";

@Injectable({
  providedIn: 'root'
})
export class DateService {                                            //moment() это текущая дата
  public date: BehaviorSubject<any> = new BehaviorSubject(moment())        //начальное значение
  public currentUser: BehaviorSubject<any> = new BehaviorSubject('')
  public currentUserRole: BehaviorSubject<any> = new BehaviorSubject('')
  public remainingFunds: BehaviorSubject<any> = new BehaviorSubject('')

  constructor() {
  }

  // метод меняющий месяц на 1 вперед или назад в компоненте header
  changeMonth(dir: number) {
    const value = this.date.value.add(dir, 'month')    //  1й парметр будет число а второй что меняем
    this.date.next(value)
  }

  // функция устанавливающая пользователя
  setUser(userData: any) {
    localStorage.setItem('userData', JSON.stringify(userData))
    // const newUser = JSON.parse(userData.nameUser) + JSON.parse(userData.surnameUser)
    const newUser = userData.user.nameUser + ' ' + userData.user.surnameUser
    this.currentUser.next(newUser)
  }

  getCurrentUser() {
    const currentUser = JSON.parse(localStorage.getItem('userData') as string)
    const currentUserRole = currentUser.user.role === 'MAIN_ADMIN' ? 'Администратор' : 'Пользователь'
    this.currentUser.next(currentUser.user.nameUser + ' ' + currentUser.user.surnameUser)
    this.currentUserRole.next(currentUserRole)
    this.remainingFunds.next(currentUser.user.remainingFunds)
  }

  // метод выбирающий тот день по которому кликнули
  changeDay(day: moment.Moment) {
    const value = this.date.value.set({
      date: day.date(),
      month: day.month()
    })
    this.date.next(value)
  }

}
