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
import {DataPersonModalComponent} from "./data-person-modal/data-person-modal.component";
import {ModalService} from "../../shared/services/modal.service";
import {ModalWindowForPersonPageComponent} from "./modal-window-for-person-page/modal-window-for-person-page.component";
import {CurrentUserDataComponent} from "./calendar-components/current-user-data/current-user-data.component";
import {InfoBlockComponent} from "./calendar-components/info-block/info-block.component";
import {ClientsListComponent} from "./calendar-components/clients-list/clients-list.component";
import {RecordingService} from "./calendar-components/recording.service";

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
    public recordingService: RecordingService,
    public modalService: ModalService,

  ) {
  }

  private destroyed$: Subject<void> = new Subject();
  inputValue = '';

  ngOnInit(): void {
    this.dateService.getCurrentUser();
    if (this.dateService.currentUserIsTheMainAdmin.value) {
      this.getAllUsers()
    } else {
      this.getAllUsersCurrentOrganization()
    }
  }


  mainePage() {
    this.router.navigate(['/'])
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
