import {Component, OnDestroy, OnInit} from '@angular/core';
import {DateService} from "../date.service";
import {AsyncPipe, DatePipe, NgForOf, NgIf} from "@angular/common";
import {MomentTransformDatePipe} from "../../../../shared/pipe/moment-transform-date.pipe";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";

@Component({
  selector: 'app-header-calendar',
  standalone: true,
  imports: [
    AsyncPipe,
    MomentTransformDatePipe,
    DatePipe,
    NgIf,
    ReactiveFormsModule,
    NgForOf
  ],
  templateUrl: './header-calendar.component.html',
  styleUrl: './header-calendar.component.css'
})
export class HeaderCalendarComponent implements OnInit, OnDestroy {

  constructor(public dateService: DateService) {
  }
  form = new FormGroup({
    maxiPeople: new FormControl(6, Validators.required),
    timeStartRec: new FormControl(18, Validators.required),
    timeFinishRec: new FormControl(18, Validators.required),
  })

  subInterval: any;
  hours: any = new Date().getHours();
  min: any = new Date().getMinutes();
  sec: any = new Date().getSeconds();
  currentTime =  '' ;
  personalData: boolean = true;
  settingsRecords: boolean = false;
  timesForRec : any = [];

  ngOnInit(): void {
    const d = new Date();
    this.currentTime = ('0' + d.getDate()).slice(-2) + '.' + ('0' + (d.getMonth() + 1)).slice(-2) + '.' + d.getFullYear()
    this.watchOnPage();
    for (let i = 0 ; i <= 23; i++) {
      this.timesForRec.push(i)
    }
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


  submit() {
    this.settingsRecords = false;
    this.dateService.changeTimeInterval(this.form.value)
  }

  closeSettings() {
    this.settingsRecords = false;
  }
}
