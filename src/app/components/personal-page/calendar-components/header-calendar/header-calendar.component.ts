import {Component, OnDestroy, OnInit} from '@angular/core';
import {DateService} from "../date.service";
import {AsyncPipe, DatePipe, NgIf} from "@angular/common";
import {MomentTransformDatePipe} from "../../../../shared/pipe/moment-transform-date.pipe";

@Component({
  selector: 'app-header-calendar',
  standalone: true,
  imports: [
    AsyncPipe,
    MomentTransformDatePipe,
    DatePipe,
    NgIf
  ],
  templateUrl: './header-calendar.component.html',
  styleUrl: './header-calendar.component.css'
})
export class HeaderCalendarComponent implements OnInit, OnDestroy {

  constructor(public dateService: DateService) {
  }
  subInterval: any;
  hours: any = new Date().getHours();
  min: any = new Date().getMinutes();
  sec: any = new Date().getSeconds();
  currentTime =  '' ;
  personalData: boolean = false;
  settingsRecords: boolean = false;

  ngOnInit(): void {
    const d = new Date();
    this.currentTime = ('0' + d.getDate()).slice(-2) + '.' + ('0' + (d.getMonth() + 1)).slice(-2) + '.' + d.getFullYear()
    this.watchOnPage();
  }

  go(direction: number) {
    this.dateService.changeMonth(direction)
  }


  //часы показывающие текущее время
  watchOnPage() {
    this.subInterval = setInterval(() => {
      this.hours = new Date().getHours();
      this.min = new Date().getMinutes();
      this.sec = new Date().getSeconds();
      this.hours = this.hours > 9 ? this.hours : "0" + this.hours;
      this.min = this.min > 9 ? this.min : "0" + this.min;
      this.sec = this.sec > 9 ? this.sec : "0" + this.sec;
    }, 1000);
  }

  ngOnDestroy(): void {
    clearInterval(this.subInterval);
  }


  switchData() {
    this.personalData = !this.personalData;
    if (this.settingsRecords) {
      this.switchSittingsData();
    }
  }

  switchSittingsData() {
    this.settingsRecords = !this.settingsRecords;
  }




}
