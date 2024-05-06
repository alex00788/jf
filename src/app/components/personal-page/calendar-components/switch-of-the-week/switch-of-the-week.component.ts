import { Component } from '@angular/core';
import {DateService} from "../date.service";
import {DataCalendarService} from "../data-calendar-new/data-calendar.service";

@Component({
  selector: 'app-switch-of-the-week',
  standalone: true,
  imports: [],
  templateUrl: './switch-of-the-week.component.html',
  styleUrl: './switch-of-the-week.component.css'
})
export class SwitchOfTheWeekComponent {
  constructor(public dateService: DateService,
              public dataCalendarService: DataCalendarService,
              ) {
  }

  go(direction: number) {
    this.dateService.changeOneWeek(direction)
    this.dataCalendarService.getAllEntryAllUsersForTheMonth()
  }

}
