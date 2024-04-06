import { Component } from '@angular/core';
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";
import {FilterOrgPipe} from "../../../../../shared/pipe/filter-org.pipe";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {DateService} from "../../date.service";

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
  ) {}
  searchOrgForRec = ''

  choiceOrgForRec(org: any) {
    this.dateService.selectedSectionOrOrganization.next(org)
  }
}
