import {Component, OnInit} from '@angular/core';
import {ModalService} from "../../shared/services/modal.service";
import {AsyncPipe, NgClass, NgForOf, NgIf} from "@angular/common";
import {Subject, takeUntil} from "rxjs";
import {ApiService} from "../../shared/services/api.service";
import {FormsModule} from "@angular/forms";
import {FilterOrgPipe} from "../../shared/pipe/filter-org.pipe";
import {DateService} from "../personal-page/calendar-components/date.service";

@Component({
  selector: 'app-reg-form-choice-organization',
  standalone: true,
  imports: [
    NgForOf,
    FormsModule,
    FilterOrgPipe,
    AsyncPipe,
    NgIf,
    NgClass
  ],
  templateUrl: './reg-form-choice-organization.component.html',
  styleUrl: './reg-form-choice-organization.component.css'
})
export class RegFormChoiceOrganizationComponent implements OnInit {
  constructor(
              private apiService: ApiService,
              private modalService: ModalService,
              public dateService: DateService,
              ) {
  }
  private destroyed$: Subject<void> = new Subject();
  searchOrg = '';
  allOrgForReset: any[] = []
  highlightBtn = false


  ngOnInit(): void {
    this.getAllOrganizationFromTheDatabase();
  }

  getAllOrganizationFromTheDatabase() {
      this.apiService.getAllOrgFromDb()
        .pipe(takeUntil(this.destroyed$))
        .subscribe(org=> {
          this.allOrgForReset = org.allOrg;
          this.dateService.allOrgNameAndId.next(org.allOrg)
          this.dateService.allOrgForReg.next(org.allOrg);
        })
  }

  choiceOrg(org: any) {
    this.highlightBtn = true;
    this.dateService.idSelectedOrg.next(org.id)
    this.dateService.allOrgForReg.next([org])
  }

  resetOrg() {
    this.highlightBtn = false;
    this.dateService.allOrgForReg.next(this.allOrgForReset);
  }


  openRegistrationPage() {
    this.dateService.selectOrgForReg.next(this.dateService.allOrgForReg.value)
    this.modalService.openRegistrationForm$();
  }

  openLoginPage() {
    this.modalService.openLoginForm$();
  }

  addNewOrg() {
    this.modalService.openFormAddNewOrg$();
  }
}
