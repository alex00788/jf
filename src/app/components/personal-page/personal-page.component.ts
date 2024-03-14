import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {ApiService} from "../../shared/services/api.service";
import {BodyCalendarComponent} from "./calendar-components/body-calendar/body-calendar.component";
import {DataCalendarComponent} from "./calendar-components/data-calendar/data-calendar.component";
import {HeaderCalendarComponent} from "./calendar-components/header-calendar/header-calendar.component";
import {ErrorModalComponent} from "../error-modal/error-modal.component";
import {DateService} from "./calendar-components/date.service";
import {CommonModule, NgForOf} from "@angular/common";
import {Subject, takeUntil} from "rxjs";
import moment from "moment";

@Component({
  selector: 'app-personal-page',
  standalone: true,
  imports: [
    BodyCalendarComponent,
    DataCalendarComponent,
    HeaderCalendarComponent,
    ErrorModalComponent,
    CommonModule,
    NgForOf
  ],
  templateUrl: './personal-page.component.html',
  styleUrl: './personal-page.component.css'
})
export class PersonalPageComponent implements OnInit {
  constructor(
    private router: Router,
    private api: ApiService,
    public dateService: DateService,
  ) {
  }
  private destroyed$: Subject<void> = new Subject();
  weekSelectedDate: any[] = [];
  showCurrentWeek: boolean = false;
  showCurrentDay: boolean = true;

  ngOnInit(): void {
    this.calculatingCurrentWeek();
    this.dateService.getCurrentUser();
  }

  calculatingCurrentWeek () {
    this.dateService.date
      .pipe(takeUntil(this.destroyed$))
      .subscribe(currentDate => {
        const m = moment(currentDate);      //текущая дата ... внутрь передаем дату по которой кликнули..
        //определяем границы недели выбранной даты
        // const startSelectedWeek = m.clone().startOf('w').add(1,'d').format('DD.MM.YYYY');
        // const endSelectedWeek = m.clone().endOf('w').add(1, 'd').format('DD.MM.YYYY');
        const currentWeek = []
        for (let i = 1; i<=7 ; i++) {
          currentWeek.push(m.clone().startOf('w').add(i,'d').format('DD.MM.YYYY'))
        }
        if (this.showCurrentWeek) {
          this.weekSelectedDate = currentWeek
        } else {
          this.weekSelectedDate = [this.dateService.date.value.format('DD.MM.YYYY')];
        }

      })
  }

  logout() {
    this.router.navigate(['/'])
  }

  logoutSystems() {
    this.router.navigate(['/'])
    this.api.logout()
  }

  showWeek() {
    this.showCurrentWeek = true;
    this.showCurrentDay = false;
    this.calculatingCurrentWeek();
  }

  showDay() {
    this.showCurrentWeek = false;
    this.showCurrentDay = true;
    this.calculatingCurrentWeek();
  }
}
