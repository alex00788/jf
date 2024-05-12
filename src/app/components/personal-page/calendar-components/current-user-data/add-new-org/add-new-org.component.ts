import { Component } from '@angular/core';
import {PersonalBlockService} from "../../personal-block.service";
import {DateService} from "../../date.service";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {Subject, takeUntil} from "rxjs";
import {ApiService} from "../../../../../shared/services/api.service";
import {NgIf} from "@angular/common";
import {SuccessService} from "../../../../../shared/services/success.service";

@Component({
  selector: 'app-add-new-org',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgIf,
  ],
  templateUrl: './add-new-org.component.html',
  styleUrl: './add-new-org.component.css'
})
export class AddNewOrgComponent {
  constructor(
    public personalBlockService: PersonalBlockService,
    public dateService: DateService,
    public successService: SuccessService,
    public apiService: ApiService,

  ) {  }
  private destroyed$: Subject<void> = new Subject();

  formAddOrg = new FormGroup({
    nameOrg: new FormControl(null, Validators.required),
    supervisorName: new FormControl(null, Validators.required),
    managerPhone: new FormControl(null, Validators.required),
  })

  addNewOrg() {
    this.apiService.addNewOrganization(this.formAddOrg.value)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((res) => {
        this.successService.localHandler(res.message)
        this.personalBlockService.windowAddingNewOrgIsOpen = false;
        this.formAddOrg.reset();
      })
  }
}
