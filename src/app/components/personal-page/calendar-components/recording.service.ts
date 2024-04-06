import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";
import moment from "moment/moment";

@Injectable({
  providedIn: 'root'
})
export class RecordingService {

  constructor() {
  }

  public weekOrMonthSelectedDate: BehaviorSubject<any> = new BehaviorSubject([])
  public showCurrentDay: BehaviorSubject<boolean> = new BehaviorSubject(true)
  public showCurrentWeek: BehaviorSubject<boolean> = new BehaviorSubject(false)
  public showCurrentMonth: BehaviorSubject<boolean> = new BehaviorSubject(false)


  //функция покажет день неделю или мес ...то что выбрал юзер
  showTheSelectedSettings() {
    const choiceUserSettings = JSON.parse(localStorage.getItem('choiceUserSet') || '{}')
    this.showCurrentDay.next(choiceUserSettings.day);
    this.showCurrentWeek.next(choiceUserSettings.week);
    this.showCurrentMonth.next(choiceUserSettings.month);
  }

  showDay(date: any) {
    this.showCurrentDay.next(true);
    this.showCurrentWeek.next(false);
    this.showCurrentMonth.next(false);
    this.calculatingCurrentWeekOrMonth(date);
  }

  showWeek(date: any) {
    this.showCurrentDay.next(false);
    this.showCurrentWeek.next(true);
    this.showCurrentMonth.next(false);
    this.calculatingCurrentWeekOrMonth(date);
  }

  showMonth(date: any) {
    this.showCurrentDay.next(false);
    this.showCurrentWeek.next(false);
    this.showCurrentMonth.next(true);
    this.calculatingCurrentWeekOrMonth(date);
  }


  //функция определяет по какой кнопке нажали и показывает день, неделю или месяц
  calculatingCurrentWeekOrMonth(currentDate: any) {
    if (this.showCurrentDay.value) {
      this.weekOrMonthSelectedDate.next([currentDate.value.format('DD.MM.YYYY')]);
      this.memorableChoice();
    }
    if (this.showCurrentWeek.value) {
      this.weekOrMonthSelectedDate.next(this.formativeShowWeek(currentDate));
      this.memorableChoice();
    }
    if (this.showCurrentMonth.value) {
      this.weekOrMonthSelectedDate.next(this.formativeShowMonth(currentDate));
      this.memorableChoice();
    }

  }


  //функция формирующая показ недели
  formativeShowWeek(currentDate: any) {
    //moment() - текущая дата ... внутрь передаем дату по которой кликнули...
    const m = moment(currentDate);   // получаем, текущей датой ту, по которой кликнули
    const currentWeek = []
    for (let i = 1; i <= 7; i++) {
      const day = m.format('dd');             // 'dd' покажет название дня... а так -> 'DD' покажет число
      if (day === 'Su' && this.showCurrentWeek) {     //если кликнули по вс
        const newM = m.subtract(1, 'd')       // то убираем 1 день чтоб неделя не перескакивала
        currentWeek.push(newM.clone().startOf('w').add(i, 'd').format('DD.MM.YYYY'))
      } else {
        currentWeek.push(m.clone().startOf('w').add(i, 'd').format('DD.MM.YYYY'))
      }
    }
    console.log('81', currentWeek)
    return currentWeek;
  }


  //функция формирующая показ месяца
  formativeShowMonth(currentDate: any) {
    const m = moment(currentDate);
    const currentMonth: any[] = [];
    // let firstDay = m.clone().startOf('month').format('DD-MM-YYYY'); // Отмечаем начало месяца!
    let lastDay = m.clone().endOf('month').format('DD-MM-YYYY'); // Установим конец месяца!
    const quantityDays = lastDay.substring(0, 2);
    for (let i = 0; i < +quantityDays; i++) {
      currentMonth.push(m.clone().startOf('month').add(i, 'd').format('DD.MM.YYYY'))
    }
    console.log('94 месяц', currentMonth)
    return currentMonth;
  }


  //функция запоминает выбор настройки, что показывать пользователю день, неделю, месяц
  memorableChoice() {
    const choiceUserSettings = {
      day: this.showCurrentDay.value,
      week: this.showCurrentWeek.value,
      month: this.showCurrentMonth.value
    }
    localStorage.setItem('choiceUserSet', JSON.stringify(choiceUserSettings));
  }


}
