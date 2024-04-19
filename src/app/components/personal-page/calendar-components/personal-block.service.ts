import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PersonalBlockService {

  constructor() { }
  personalData: boolean = true;
  recordsBlock: boolean = true;
  settingsRecords: boolean = false;
  changeSettingsRecordsBlock: boolean = false;
  windowAddingNewOrgIsOpen: boolean = false;


  switchData() {
    this.personalData = !this.personalData;
    if (this.settingsRecords) {
      this.switchSittingsData();
    }
  }

  switchSittingsData() {
    this.windowAddingNewOrgIsOpen = false;
    this.settingsRecords = !this.settingsRecords;
    if (this.settingsRecords) {
      this.changeSettingsRecordsBlock =false;
    }
  }

  addNewOrgSettings () {
    this.windowAddingNewOrgIsOpen = true;
    this.settingsRecords = false;
  }


  changeSettingsRecords() {
    this.settingsRecords = !this.settingsRecords;
    this.changeSettingsRecordsBlock = true;
  }

  openRecordsBlock() {
    this.recordsBlock = true;
  }

  closeRecordsBlock() {
    this.recordsBlock = false;
  }

  closeWindowAddedNewOrg() {
    this.windowAddingNewOrgIsOpen = false;
  }

  closeSettings() {
    this.changeSettingsRecordsBlock = false;
    this.settingsRecords = false;
  }
}
