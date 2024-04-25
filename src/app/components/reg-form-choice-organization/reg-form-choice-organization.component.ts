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
          const allOrgName = allOrg.allOrg.map((el:any) => el.name);
          this.dateService.allOrgNameAndId.next(allOrg.allOrg)
          this.allOrgForReset = allOrgName;
          this.dateService.allOrgForReg.next(allOrgName);
        })
  }

  choiceOrg(org: any) {
    this.highlightBtn = true;
    const selectOrg = this.dateService.allOrgForReg.value.find((el:any)=>
    el === org)
    const selectOrgId = this.dateService.allOrgNameAndId.value.find((el:any)=>
      el.name === org)
    this.dateService.allOrgNameAndId.next([selectOrgId])
    this.dateService.allOrgForReg.next([selectOrg])
  }

  resetOrg() {
    this.highlightBtn = false;
    this.dateService.allOrgForReg.next(this.allOrgForReset);
  }

  addNewOrg() {
    this.modalService.openFormAddNewOrg$();
  }
}
