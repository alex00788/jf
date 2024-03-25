import {Component, OnDestroy, OnInit} from '@angular/core';
import {DateService} from "../date.service";
import {AsyncPipe, DatePipe, NgForOf, NgIf} from "@angular/common";
import {MomentTransformDatePipe} from "../../../../shared/pipe/moment-transform-date.pipe";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {ApiService} from "../../../../shared/services/api.service";
import {Subject, takeUntil} from "rxjs";

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

  constructor(
    public dateService: DateService,
    public apiService: ApiService,
              ) {
  }
  form = new FormGroup({
    maxiPeople: new FormControl(this.dateService.maxPossibleEntries.value, Validators.required),
    timeStartRec: new FormControl(this.dateService.timeStartRecord.value, Validators.required),
    timeFinishRec: new FormControl(this.dateService.timeFinishRecord.value, Validators.required),
  })

  formAddOrg = new FormGroup({
    nameOrg: new FormControl(null, Validators.required),
    supervisorName: new FormControl(null, Validators.required),
    poneSupervisor: new FormControl(null, Validators.required),
  })

  subInterval: any;
  hours: any = new Date().getHours();
  min: any = new Date().getMinutes();
  sec: any = new Date().getSeconds();
  currentTime =  '' ;
  dataSettings:  any;
  personalData: boolean = true;
  settingsRecords: boolean = false;
  windowAddingNewOrgIsOpen: boolean = false;
  showSettings: boolean;
  timesForRec : any = [];
  private destroyed$: Subject<void> = new Subject();

  ngOnInit(): void {
    this.showSettings = !this.dateService.currentUserSimpleUser.value;
    const dataSettings = localStorage.getItem('dataSettings')
    if (dataSettings) {
      this.dataSettings = JSON.parse(dataSettings);
      this.dateService.timeStartRecord.next(+this.dataSettings.dataSettings.timeStartRec);
      this.dateService.timeFinishRecord.next(+this.dataSettings.dataSettings.timeFinishRec);
      this.dateService.maxPossibleEntries.next(+this.dataSettings.dataSettings.maxiPeople);
    }
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
    this.windowAddingNewOrgIsOpen = false;
    this.settingsRecords = !this.settingsRecords;
  }


  addNewOrgSettings () {
    this.settingsRecords = false;
    this.windowAddingNewOrgIsOpen = !this.windowAddingNewOrgIsOpen;
  }

  submit() {
    this.settingsRecords = false;
    this.dateService.changeTimeInterval(this.form.value)
    this.dataSettings = JSON.stringify( {dataSettings: this.form.value})
    localStorage.setItem('dataSettings', this.dataSettings);
  }

  closeSettings() {
    this.settingsRecords = false;
  }

  closeWindowAddedNewOrg() {
    this.windowAddingNewOrgIsOpen = false;
  }

  addNewOrg() {
    this.apiService.addNewOrganization(this.formAddOrg.value)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(() => {
        this.windowAddingNewOrgIsOpen = false;
        this.formAddOrg.reset();
      })
  }
}
