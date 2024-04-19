import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";


@Injectable({
  providedIn: 'root'
})
export class RecordingService {

  constructor() {
  }

  public showCurrentDay: BehaviorSubject<boolean> = new BehaviorSubject(true)
  public showCurrentWeek: BehaviorSubject<boolean> = new BehaviorSubject(false)
  public showCurrentMonth: BehaviorSubject<boolean> = new BehaviorSubject(false)


  showDay() {
    this.showCurrentDay.next(true);
    this.showCurrentWeek.next(false);
    this.showCurrentMonth.next(false);
  }

  showWeek() {
    this.showCurrentDay.next(false);
    this.showCurrentWeek.next(true);
    this.showCurrentMonth.next(false);
  }

  showMonth() {
    this.showCurrentDay.next(false);
    this.showCurrentWeek.next(false);
    this.showCurrentMonth.next(true);
  }


}
