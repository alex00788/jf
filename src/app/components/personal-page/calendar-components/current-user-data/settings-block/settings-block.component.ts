import {Component, OnInit} from '@angular/core';
import {PersonalBlockService} from "../../personal-block.service";
import {DateService} from "../../date.service";
import {ApiService} from "../../../../../shared/services/api.service";
import {NgForOf, NgIf} from "@angular/common";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {DataCalendarService} from "../../data-calendar-new/data-calendar.service";

@Component({
  selector: 'app-settings-block',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgIf,
    NgForOf
  ],
  templateUrl: './settings-block.component.html',
  styleUrl: './settings-block.component.css'
})
export class SettingsBlockComponent implements OnInit{
  constructor(
    public personalBlockService: PersonalBlockService,
    public dateService: DateService,
    public dataCalendarService: DataCalendarService,
    public apiService: ApiService,

  ) {  }
  dataSettings:  any;
  timesForRec : any = [];
  form = new FormGroup({
    maxiPeople: new FormControl(this.dateService.maxPossibleEntries.value, Validators.required),
    timeStartRec: new FormControl(this.dateService.timeStartRecord.value, Validators.required),
    timeFinishRec: new FormControl(this.dateService.timeFinishRecord.value, Validators.required),
  })

  ngOnInit(): void {
    //  для настройки интервала времени в которое можно записаться
    for (let i = 0 ; i <= 23; i++) {
      this.timesForRec.push(i)
    }
  }

  submit() {
    this.personalBlockService.settingsRecords = false;
    this.dateService.changeTimeInterval(this.form.value)
    this.dataSettings = JSON.stringify( {dataSettings: this.form.value})
    localStorage.setItem('dataSettings', this.dataSettings);
    this.dataCalendarService.getAllEntryAllUsersForTheMonth();
  }


}
