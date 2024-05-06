import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {ApiService} from "../../shared/services/api.service";
import {BodyCalendarComponent} from "./calendar-components/body-calendar/body-calendar.component";
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
import {DataCalendarNewComponent} from "./calendar-components/data-calendar-new/data-calendar-new.component";
import {DayWeekMonthComponent} from "./calendar-components/day-week-month/day-week-month.component";
import {
  SelectOrgToDisplayComponent
} from "./calendar-components/current-user-data/select-org-to-display/select-org-to-display.component";
import {DataCalendarService} from "./calendar-components/data-calendar-new/data-calendar.service";
import {TranslateMonthPipe} from "../../shared/pipe/translate-month.pipe";
import {PersonalBlockService} from "./calendar-components/personal-block.service";
import {RecordingService} from "./calendar-components/recording.service";
import {RecordsBlockComponent} from "./calendar-components/current-user-data/records-block/records-block.component";
import {AddNewOrgComponent} from "./calendar-components/current-user-data/add-new-org/add-new-org.component";
import {
  PersonalDataBlockComponent
} from "./calendar-components/current-user-data/personal-data-block/personal-data-block.component";
import {SettingsBlockComponent} from "./calendar-components/current-user-data/settings-block/settings-block.component";


@Component({
  selector: 'app-personal-page',
  standalone: true,
  imports: [
    BodyCalendarComponent,
    HeaderCalendarComponent,
    ErrorModalComponent,
    CommonModule,
    NgForOf,
    DataPersonModalComponent,
    ModalWindowForPersonPageComponent,
    CurrentUserDataComponent,
    InfoBlockComponent,
    ClientsListComponent,
    DataCalendarNewComponent,
    DayWeekMonthComponent,
    SelectOrgToDisplayComponent,
    TranslateMonthPipe,
    RecordsBlockComponent,
    AddNewOrgComponent,
    PersonalDataBlockComponent,
    SettingsBlockComponent,
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
    public recordingService: RecordingService,
    public dataCalendarService: DataCalendarService,
    public personalBlockService: PersonalBlockService,
  ) {
  }

  private destroyed$: Subject<void> = new Subject();
  inputValue = '';

  ngOnInit(): void {
    this.dateService.getCurrentUser(); // заполняет блок мои данные
    this.getAllOrg();
    this.dataCalendarService.getAllUsersCurrentOrganization();
  }


  //Получаем все зарегистрированные организации из бд для переключения данных
  getAllOrg() {
    this.apiService.getAllOrgFromDb()
      .pipe(takeUntil(this.destroyed$))
      .subscribe(org=> {
        this.dateService.allOrganization.next(org.allOrg);
      })
  }


  mainePage() {
    this.router.navigate(['/'])
  }
  logoutSystems() {
    this.modalService.showTitle();
    this.router.navigate(['/'])
    this.apiService.logout()
  }
}
