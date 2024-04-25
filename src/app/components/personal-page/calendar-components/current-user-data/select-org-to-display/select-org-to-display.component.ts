import {Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
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
                  private el: ElementRef
  ) {}

  searchOrgForRec = '';
  showSelectedOrg = false;

  @ViewChild('inputSearchOrg') inputSearchOrgRef: ElementRef;
//оределяем, что кликнули за пределом блока div
  @HostListener('document:click', ['$event']) onClick(event: Event) {
    // элемент в котором находимся есть в том по которому кликнули?
    if (!this.el.nativeElement.contains(event.target)) {
      this.showSelectedOrg = false;
      //this.el.nativeElement,... тот элемент, в котором находимся
      //event.target... тот по которому кликаем
    }
  }





  choiceOrgForRec(org: any) {
    this.dateService.currentOrg.next(org)
    this.showSelectedOrg = false;
    this.dateService.selectedSectionOrOrganization.next(org);
    this.dataCalendarService.getAllEntryAllUsersForTheMonth();
    this.dateService.getUsersSelectedOrg(org);
  }



  changeOrg() {
    setTimeout(()=> {
      this.showSelectedOrg = true;
    },50)
  }
}
