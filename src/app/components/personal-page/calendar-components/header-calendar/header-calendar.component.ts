import {Component} from '@angular/core';
import {DateService} from "../date.service";
import {AsyncPipe, DatePipe} from "@angular/common";
import {MomentTransformDatePipe} from "../../../../shared/pipe/moment-transform-date.pipe";

@Component({
  selector: 'app-header-calendar',
  standalone: true,
  imports: [
    AsyncPipe,
    MomentTransformDatePipe,
    DatePipe
  ],
  templateUrl: './header-calendar.component.html',
  styleUrl: './header-calendar.component.css'
})
export class HeaderCalendarComponent {
  constructor(public dateService: DateService) {
  }

  go(direction: number) {
    this.dateService.changeMonth(direction)
  }
}
