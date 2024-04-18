import {Component, ElementRef, ViewChild} from '@angular/core';
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";
import {FilterOrgPipe} from "../../../../../shared/pipe/filter-org.pipe";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {DateService} from "../../date.service";
import {DataCalendarService} from "../../data-calendar-new/data-calendar.service";

@Component({
  selector: 'app-select-org-to-display',
  standalone: true,
  imports: [
    AsyncPipe,
    NgForOf,
    FormsModule,
    ReactiveFormsModule,
    FilterOrgPipe,
    NgIf
  ],
  templateUrl: './select-org-to-display.component.html',
  styleUrl: './select-org-to-display.component.css'
})
export class SelectOrgToDisplayComponent {
  constructor(    public dateService: DateService,
                  public dataCalendarService: DataCalendarService,
  ) {}
  searchOrgForRec = ''
  @ViewChild('inputSearchOrg') inputSearchOrgRef: ElementRef;
  showSelectedOrg = false;



  choiceOrgForRec(org: any) {
    this.showSelectedOrg = false;
    this.dateService.selectedSectionOrOrganization.next(org);
    this.dataCalendarService.getAllEntryAllUsersForTheMonth();
    this.dateService.getUsersSelectedOrg(org);
  }



  changeOrg() {
    this.showSelectedOrg = true;
  }
}
