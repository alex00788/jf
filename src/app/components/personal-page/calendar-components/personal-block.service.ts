import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PersonalBlockService {

  constructor() { }
  personalData: boolean = true;
  recordsBlock: boolean = true;
  settingsRecords: boolean = false;
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
  }

  addNewOrgSettings () {
    this.windowAddingNewOrgIsOpen = true;
    this.settingsRecords = false;
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
    this.settingsRecords = false;
  }
}
