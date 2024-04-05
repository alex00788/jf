import {Component, OnInit} from '@angular/core';
import {DateService} from "../date.service";
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {Subject, takeUntil} from "rxjs";
import {ApiService} from "../../../../shared/services/api.service";
import {TranslateMonthPipe} from "../../../../shared/pipe/translate-month.pipe";

@Component({
  selector: 'app-current-user-data',
  standalone: true,
  imports: [
    AsyncPipe,
    ReactiveFormsModule,
    NgForOf,
    NgIf,
    TranslateMonthPipe
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

  personalData: boolean = false;
  settingsRecords: boolean = false;
  recordsBlock: boolean = false;
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
    this.recordingDaysChanged();
    this.showSettings = !this.dateService.currentUserSimpleUser.value;
    this.recordsBlock = false;
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


  //при смене записи обновляет дни когда я записан
  recordingDaysChanged() {
    this.dateService.recordingDaysChanged
      .pipe(takeUntil(this.destroyed$))
      .subscribe(()=>{
        this.openRecordsBlock();
      })
  }

  closeRecordsBlock() {
    this.recordsBlock = false;
  }

  //открывает блок с датами в месяце, когда записан пользователь
  openRecordsBlock() {
    this.recordsBlock = true;
    const dataForGetAllEntrySelectedMonth = {
      org: this.dateService.sectionOrOrganization.value,
      month: this.dateService.date.value.format('MM'),
      year: this.dateService.date.value.format('YYYY'),
      userId: this.dateService.currentUserId.value
    }
    this.getAllEntryCurrentUserInSelectedMonth(dataForGetAllEntrySelectedMonth);
  }

  //Возмет с бека все записи текущей пользователя за выбранный месяц
  getAllEntryCurrentUserInSelectedMonth(dataForGetAllEntry:any) {
    this.apiService.getAllEntryCurrentUserInMonth(dataForGetAllEntry)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(allEntryInMonth => {
        this.dateService.allEntryCurUserInSelectMonth.next(allEntryInMonth)
      });
  }

  //удаление записи в блоке всех записей пользователя
  deleteSelectedRec(selectedRec: any) {
    this.apiService.deleteEntry(selectedRec.id, selectedRec.userId)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(() => {
        this.dateService.remainingFunds.next(JSON.stringify(+this.dateService.remainingFunds.value + 1))
        this.dateService.recordingDaysChanged.next(true);
        const newAllUsers: any[] = []
        this.dateService.allUsers.value.forEach((el: any) => {
          if ((el: any) => el.id === this.dateService.currentUserId.value) {
            el.remainingFunds = this.dateService.remainingFunds.value
          }
          newAllUsers.push(el)
        })
        this.dateService.allUsers.next(newAllUsers)
        this.dateService.blockRecIfRecorded.next(false);
      })
  }

}
