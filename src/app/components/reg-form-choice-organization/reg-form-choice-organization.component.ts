import {Component, OnInit} from '@angular/core';
import {ModalService} from "../../shared/services/modal.service";
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";
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
    NgIf
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


  ngOnInit(): void {
    this.getAllOrganizationFromTheDatabase();
  }

  openRegistrationPage() {
    this.dateService.selectOrgForReg.next(this.dateService.allOrgForReg.value)
    this.modalService.openRegistrationForm$();
  }

  openLoginPage() {
    this.modalService.openLoginForm$();
  }

  getAllOrganizationFromTheDatabase() {
    this.apiService.getAllOrgFromDb()
      .pipe(takeUntil(this.destroyed$))
      .subscribe(allOrg=> {
        this.allOrgForReset = allOrg.allOrg;
        this.dateService.allOrgForReg.next(allOrg.allOrg);
      })
  }

  choiceOrg(org: any) {
    const selectOrg = this.dateService.allOrgForReg.value.find((el:any)=>
    el === org)
    console.log(selectOrg)
    this.dateService.allOrgForReg.next([selectOrg])
  }

  resetOrg() {
    this.dateService.allOrgForReg.next(this.allOrgForReset);
  }

  addNewOrg() {
    this.modalService.openFormAddNewOrg$();
  }
}
