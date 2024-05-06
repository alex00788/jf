import {Component, OnInit} from '@angular/core';
import {DateService} from "../date.service";
import {AsyncPipe} from "@angular/common";
import {MomentTransformDatePipe} from "../../../../shared/pipe/moment-transform-date.pipe";
import {DataCalendarService} from "../data-calendar-new/data-calendar.service";

@Component({
  selector: 'app-info-block',
  standalone: true,
  imports: [
    AsyncPipe,
    MomentTransformDatePipe
  ],
  templateUrl: './info-block.component.html',
  styleUrl: './info-block.component.css'
})
export class InfoBlockComponent implements OnInit {
  constructor(
    public dateService: DateService,
    public dataCalendarService: DataCalendarService,
  ) {}
  currentTime = '';

  ngOnInit(): void {
    const d = new Date();   // показывает сегодняшнюю дату
    this.currentTime = ('0' + d.getDate()).slice(-2) + '.' + ('0' + (d.getMonth() + 1)).slice(-2) + '.' + d.getFullYear()
  }

  go(direction: number) {
    this.dateService.changeOneDay(direction)
    this.dataCalendarService.getAllEntryAllUsersForTheMonth()
  }
}
