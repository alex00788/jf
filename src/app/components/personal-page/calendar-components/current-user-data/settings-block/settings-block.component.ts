import {Component, OnInit} from '@angular/core';
import {PersonalBlockService} from "../../personal-block.service";
import {DateService} from "../../date.service";
import {ApiService} from "../../../../../shared/services/api.service";
import {NgForOf, NgIf} from "@angular/common";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {DataCalendarService} from "../../data-calendar-new/data-calendar.service";
import {Subject, takeUntil} from "rxjs";
import {SuccessService} from "../../../../../shared/services/success.service";

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
    public successService: SuccessService
  ) {  }
  private destroyed$: Subject<void> = new Subject();
  dataSettings:  any;
  timesForRec : any = [''];
  form = new FormGroup({
    maxiPeople: new FormControl(this.dateService.maxPossibleEntries.value, Validators.required),
    timeStartRec: new FormControl(this.dateService.timeStartRecord.value, Validators.required),
    timeFinishRec: new FormControl(this.dateService.timeFinishRecord.value, Validators.required),
    location: new FormControl(this.dateService.location.value, Validators.required),
    phoneOrg: new FormControl(this.dateService.phoneOrg.value, Validators.required),
  })

  ngOnInit(): void {
    this.dateService.changedSettingsOrg
    .pipe(takeUntil(this.destroyed$))
    .subscribe(settingsCurrentOrgHaveBeenChanged => {
      if (settingsCurrentOrgHaveBeenChanged) {
        this.dataForBlockShowCurrentSettings();
      }
    })
    //  для настройки интервала времени в которое можно записаться
    for (let i = 0 ; i <= 23; i++) {
      this.timesForRec.push(i)
    }
  }

  dataForBlockShowCurrentSettings() {
    if (!this.dateService.timeStartRecord.value) {
      this.dateService.timeStartRecord.next(this.form.value.timeStartRec)
    }
    if (!this.dateService.timeFinishRecord.value) {
      this.dateService.timeFinishRecord.next(this.form.value.timeFinishRec)
    }
    if (!this.dateService.maxPossibleEntries.value) {
      this.dateService.maxPossibleEntries.next(this.form.value.maxiPeople)
    }
    if (!this.dateService.location.value) {
      this.dateService.location.next(this.form.value.location)
    }
    if (!this.dateService.phoneOrg.value) {
      this.dateService.phoneOrg.next(this.form.value.phoneOrg)
    }
  }


  submit() {
    const currentUser = this.dateService.allUsersSelectedOrg.value.find((us: any) => us.id == this.dateService.currentUserId.value)
    this.personalBlockService.closeSettings();
    this.personalBlockService.settingsRecords = false;
    this.dateService.changeSettingsRec(this.form.value)
    const dataSettings = {
      nameUser: currentUser.nameUser,
      surnameUser: currentUser.surnameUser,
      userId: this.dateService.currentUserId.value,
      orgId: this.dateService.idSelectedOrg.value,
      nameOrg: this.dateService.sectionOrOrganization.value,
      roleSelectedOrg: this.dateService.currentUserRole.value,
      remainingFunds: this.dateService.remainingFunds.value,
      maxiPeople: this.form.value.maxiPeople,
      timeStartRec: this.form.value.timeStartRec,
      timeFinishRec: this.form.value.timeFinishRec,
      location: this.form.value.location,
      phoneOrg: this.form.value.phoneOrg,
    }
    this.apiService.setSettings(dataSettings)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((set: any) => {
        this.dateService.timeStartRecord.next(set.newSettings.timeStartRec);
        this.dateService.timeFinishRecord.next(set.newSettings.timeLastRec);
        this.dateService.maxPossibleEntries.next(set.newSettings.maxClients);
        this.dateService.location.next(set.newSettings.location);
        this.dateService.phoneOrg.next(set.newSettings.phoneOrg);
        this.dateService.changedSettingsOrg.next(true);
        this.successService.localHandler('Настройки сохранены');
      });

    this.dataCalendarService.getAllEntryAllUsersForTheMonth();
  }


}
