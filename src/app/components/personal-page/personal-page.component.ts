import { Component } from '@angular/core';
import {Router} from "@angular/router";
import {ApiService} from "../../shared/services/api.service";
import {BodyCalendarComponent} from "./calendar-components/body-calendar/body-calendar.component";
import {DataCalendarComponent} from "./calendar-components/data-calendar/data-calendar.component";
import {HeaderCalendarComponent} from "./calendar-components/header-calendar/header-calendar.component";
import {ErrorModalComponent} from "../error-modal/error-modal.component";

@Component({
  selector: 'app-personal-page',
  standalone: true,
    imports: [
        BodyCalendarComponent,
        DataCalendarComponent,
        HeaderCalendarComponent,
        ErrorModalComponent
    ],
  templateUrl: './personal-page.component.html',
  styleUrl: './personal-page.component.css'
})
export class PersonalPageComponent {
  constructor(private router: Router,
              private api: ApiService) {
  }

  logout() {
    this.router.navigate(['/'])
  }

  logoutSystems() {
    this.router.navigate(['/'])
    this.api.logout()
  }
}
