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
import {CurrentUserDataComponent} from "./calendar-components/current-user-data/current-user-data.component";
import {InfoBlockComponent} from "./calendar-components/info-block/info-block.component";
import {ClientsListComponent} from "./calendar-components/clients-list/clients-list.component";

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
    ModalWindowForPersonPageComponent,
    CurrentUserDataComponent,
    InfoBlockComponent,
    ClientsListComponent,
  ],
  templateUrl: './personal-page.component.html',
  styleUrl: './personal-page.component.css'
})
export class PersonalPageComponent implements OnInit {
  constructor(
    private router: Router,
    private apiService: ApiService,
    public dateService: DateService,
    public modalService: ModalService,

  ) {
  }

  private destroyed$: Subject<void> = new Subject();
  weekSelectedDate: any[] = [];
  showCurrentWeek: boolean = false;
  showCurrentMonth: boolean = false;
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

  //функция формирующая показ недели
  formativeShowWeek(currentDate: any) {
    //moment() - текущая дата ... внутрь передаем дату по которой кликнули...
    const m = moment(currentDate);   // получаем, текущей датой ту, по которой кликнули
    const currentWeek = []
    for (let i = 1; i <= 7; i++) {
      const day = m.format('dd');             // 'dd' покажет название дня... а так -> 'DD' покажет число
      if ( day === 'Su' && this.showCurrentWeek) {     //если кликнули по вс
        const newM = m.subtract(1,'d')       // то убираем 1 день чтоб неделя не перескакивала
        currentWeek.push(newM.clone().startOf('w').add(i, 'd').format('DD.MM.YYYY'))
      } else {
        currentWeek.push(m.clone().startOf('w').add(i, 'd').format('DD.MM.YYYY'))
      }
    }
    return currentWeek;
  }


  //функция формирующая показ месяца
  formativeShowMonth(currentDate: any) {
    const m = moment(currentDate);
    const currentMonth: any[] = [];
    // let firstDay = m.clone().startOf('month').format('DD-MM-YYYY'); // Отмечаем начало месяца!
    let lastDay = m.clone().endOf('month').format('DD-MM-YYYY'); // Установим конец месяца!
    const quantityDays = lastDay.substring(0, 2);
    for(let i = 0 ; i < +quantityDays; i++) {
      currentMonth.push(m.clone().startOf('month').add(i, 'd').format('DD.MM.YYYY'))
    }
    return currentMonth;
  }


//функция определяет по какой кнопке нажали и показывает день, неделю или месяц
  calculatingCurrentWeek() {
    this.dateService.date
      .pipe(takeUntil(this.destroyed$))
      .subscribe(currentDate => {
        if (this.showCurrentMonth) {
          this.weekSelectedDate = this.formativeShowMonth(currentDate);
        }
        if (this.showCurrentWeek) {
          this.weekSelectedDate = this.formativeShowWeek(currentDate);
        }
        if (this.showCurrentDay) {
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
    this.showCurrentMonth = false;
    this.calculatingCurrentWeek();
    this.memorableChoice();
  }

  showMonth() {
    this.showCurrentWeek = false;
    this.showCurrentDay = false;
    this.showCurrentMonth = true;
    this.calculatingCurrentWeek();
  }

  showDay() {
    this.showCurrentWeek = false;
    this.showCurrentDay = true;
    this.showCurrentMonth = false;
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
  getAllUsers() {                              // функция должна срабатывать только для главного админа
    this.apiService.getAllUsers()
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
    this.apiService.getAllUsersCurrentOrganization(this.dateService.sectionOrOrganization.value)
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

  logoutSystems() {
    this.router.navigate(['/'])
    this.apiService.logout()
  }
}
