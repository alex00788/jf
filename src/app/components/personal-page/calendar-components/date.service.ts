import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";
import moment from "moment";

@Injectable({
  providedIn: 'root'
})
export class DateService {                                            //moment() это текущая дата
  public date: BehaviorSubject<any> = new BehaviorSubject(moment())        //начальное значение
  public currentUser: BehaviorSubject<any> = new BehaviorSubject('')
  public currentUserId: BehaviorSubject<any> = new BehaviorSubject('')
  public currentUserRole: BehaviorSubject<any> = new BehaviorSubject('')
  public roleToGetTheDesiredListOfUsers: BehaviorSubject<any> = new BehaviorSubject('')
  public remainingFunds: BehaviorSubject<any> = new BehaviorSubject('')
  public allUsers: BehaviorSubject<any> = new BehaviorSubject([])
  public sectionOrOrganization: BehaviorSubject<any> = new BehaviorSubject('')
  public timeStartRecord: BehaviorSubject<any> = new BehaviorSubject(18)
  public timeFinishRecord: BehaviorSubject<any> = new BehaviorSubject(19)
  public maxPossibleEntries: BehaviorSubject<any> = new BehaviorSubject(3)

  public dataSelectedUser: BehaviorSubject<any> = new BehaviorSubject({})

  constructor() {
  }

  // метод меняющий месяц на 1 вперед или назад в компоненте header
  changeMonth(dir: number) {
    const value = this.date.value.add(dir, 'month')    //  1й парметр будет число, а второй, что меняем
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
    let currentUserRole = currentUser.user.role === 'MAIN_ADMIN' ? 'Администратор' : 'Пользователь'
    if (currentUser.user.role === 'ADMIN') {
      currentUserRole = 'Админ группы'
    }
    this.currentUser.next(currentUser.user.nameUser + ' ' + currentUser.user.surnameUser)
    this.currentUserId.next(currentUser.user.id)
    this.currentUserRole.next(currentUserRole)
    this.remainingFunds.next(currentUser.user.remainingFunds)
    this.sectionOrOrganization.next(currentUser.user.sectionOrOrganization)
    this.roleToGetTheDesiredListOfUsers.next(currentUser.user.role)
  }

  // метод выбирающий тот день по которому кликнули
  changeDay(day: moment.Moment) {
    const value = this.date.value.set({
      date: day.date(),
      month: day.month()
    })
    this.date.next(value)
  }

  changeTimeInterval(timeVal: any) {
    this.timeStartRecord.next(+timeVal.timeStartRec)
    this.timeFinishRecord.next(+timeVal.timeFinishRec)
    this.maxPossibleEntries.next(timeVal.maxiPeople)
  }

}
