import {Component, OnInit} from '@angular/core';
import {DateService} from "../date.service";
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {Subject, takeUntil} from "rxjs";
import {ApiService} from "../../../../shared/services/api.service";

@Component({
  selector: 'app-current-user-data',
  standalone: true,
  imports: [
    AsyncPipe,
    ReactiveFormsModule,
    NgForOf,
    NgIf
  ],
  templateUrl: './current-user-data.component.html',
  styleUrl: './current-user-data.component.css'
})
export class CurrentUserDataComponent implements OnInit {
  constructor(
    public dateService: DateService,
    public apiService: ApiService,

  ) {
  }
  private destroyed$: Subject<void> = new Subject();

  personalData: boolean = true;
  settingsRecords: boolean = false;
  windowAddingNewOrgIsOpen: boolean = false;
  showSettings: boolean;
  timesForRec : any = [];
  dataSettings:  any;


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

  ngOnInit(): void {
    this.showSettings = !this.dateService.currentUserSimpleUser.value;

    //  для настройки интервала времени в которое можно записаться
    for (let i = 0 ; i <= 23; i++) {
      this.timesForRec.push(i)
    }
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


  addNewOrg() {
    this.apiService.addNewOrganization(this.formAddOrg.value)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(() => {
        this.windowAddingNewOrgIsOpen = false;
        this.formAddOrg.reset();
      })
  }


  closeWindowAddedNewOrg() {
    this.windowAddingNewOrgIsOpen = false;
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



}
