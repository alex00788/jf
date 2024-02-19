import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";
import moment from "moment";

@Injectable({
  providedIn: 'root'
})
export class DateService {                                            //moment() это текущая дата
    public date: BehaviorSubject<any> = new BehaviorSubject(moment())        //начальное значение
  constructor() { }

  // метод меняющий месяц на 1 вперед или назад в компоненте header
  changeMonth(dir: number) {
      const value = this.date.value.add(dir, 'month')    //  1й парметр будет число а второй что меняем
      this.date.next(value)
  }



  // метод выбирающий тот день по которому кликнули
  changeDay(day: moment.Moment) {
      const value = this.date.value.set({
        date: day.date(),
        month: day.month()
      })
    console.log('7777', value)
    this.date.next(value)
  }

}
