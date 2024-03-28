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
import {DataPersonModalComponent} from "./data-person-modal/data-person-modal.component";
import {ModalService} from "../../shared/services/modal.service";
import {ModalWindowForPersonPageComponent} from "./modal-window-for-person-page/modal-window-for-person-page.component";

@Component({
  selector: 'app-personal-page',
  standalone: true,
  imports: [
    BodyCalendarComponent,
    DataCalendarComponent,
    HeaderCalendarComponent,
    ErrorModalComponent,
    CommonModule,
    NgForOf,
    DataPersonModalComponent,
    ModalWindowForPersonPageComponent
  ],
  templateUrl: './personal-page.component.html',
  styleUrl: './personal-page.component.css'
})
export class PersonalPageComponent implements OnInit {
  constructor(
    private router: Router,
    private api: ApiService,
    public dateService: DateService,
    public modalService: ModalService,
  ) {
  }

  private destroyed$: Subject<void> = new Subject();
  weekSelectedDate: any[] = [];
  showCurrentWeek: boolean = false;
  showCurrentDay: boolean = true;
  inputValue = '';

  ngOnInit(): void {
    this.showTheSelectedSettings();
    this.calculatingCurrentWeek();
    this.dateService.getCurrentUser();
    if (this.dateService.currentUserIsTheMainAdmin.value) {
      this.getAllUsers()
    } else {
      this.getAllUsersCurrentOrganization()
    }
  }

  calculatingCurrentWeek() {
    this.dateService.date
      .pipe(takeUntil(this.destroyed$))
      .subscribe(currentDate => {
        const m = moment(currentDate);      //текущая дата ... внутрь передаем дату по которой кликнули..
        //определяем границы недели выбранной даты
        // const startSelectedWeek = m.clone().startOf('w').add(1,'d').format('DD.MM.YYYY');
        // const endSelectedWeek = m.clone().endOf('w').add(1, 'd').format('DD.MM.YYYY');
        const currentWeek = []
        for (let i = 1; i <= 7; i++) {
          currentWeek.push(m.clone().startOf('w').add(i, 'd').format('DD.MM.YYYY'))
        }
        // console.log( currentWeek)
        console.log('71', m.format('DD.MM.YYYY'))
        // console.log(endSelectedWeek , 'при нажатии на последний день недели показывает след неделя')
        if (this.showCurrentWeek) {
          this.weekSelectedDate = currentWeek
        } else {
          this.weekSelectedDate = [this.dateService.date.value.format('DD.MM.YYYY')];
        }

      })
  }

  mainePage() {
    this.router.navigate(['/'])
  }


  showWeek() {
    this.showCurrentWeek = true;
    this.showCurrentDay = false;
    this.calculatingCurrentWeek();
    this.memorableChoice();
  }

  showDay() {
    this.showCurrentWeek = false;
    this.showCurrentDay = true;
    this.calculatingCurrentWeek();
    this.memorableChoice();
  }


  //функция запоминает выбор настройки, что показывать пользователю день, неделю, месяц
  memorableChoice() {
    const choiceUserSettings = {
      month: this.showCurrentWeek,
      day: this.showCurrentDay
    }
    localStorage.setItem('choiceUserSet', JSON.stringify(choiceUserSettings));
  }

  //функция покажет день неделю или мес ...то что выбрал юзер
  showTheSelectedSettings() {
    const choiceUserSettings = JSON.parse(localStorage.getItem('choiceUserSet') || '{}')
    this.showCurrentWeek = choiceUserSettings.month;
    this.showCurrentDay = choiceUserSettings.day;
  }

  // функция, возьмет всех пользователей которые зарегистрированы (для записи клиентов тока из предложенных)
  getAllUsers() {
    this.api.getAllUsers()
      .pipe(takeUntil(this.destroyed$))
      .subscribe(allUsers => {
        const getAllOrganization = new Set(allUsers.map((el: any) => el.sectionOrOrganization));
        this.dateService.allOrganization.next([...getAllOrganization]);
        const user = allUsers.find((el: any) => {
          return el.id === this.dateService.currentUserId.value
        })
        this.dateService.remainingFunds.next(user.remainingFunds)
        this.dateService.allUsers.next(allUsers)
      });
  }


  //функция, возьмет пользователей конкретной организации
  getAllUsersCurrentOrganization() {
    this.api.getAllUsersCurrentOrganization(this.dateService.sectionOrOrganization.value)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(allUsersOrganization => {
        const user = allUsersOrganization.find((el: any) => {
          return el.id === this.dateService.currentUserId.value
        })
        this.dateService.remainingFunds.next(user.remainingFunds)
        this.dateService.allUsers.next(allUsersOrganization)
      });
  }


  choosingOrganization(event: any) {
    const filterOrg = this.dateService.allOrganization.value
      .filter((el: any) => el.toLowerCase().includes(event?.target.value.toLowerCase())
    )
      if (filterOrg.length === 1) {
        this.inputValue = filterOrg;
        this.dateService.selectedSectionOrOrganization.next(filterOrg[0])
      } else {
        this.dateService.selectedSectionOrOrganization.next([])
      }
  }
}
