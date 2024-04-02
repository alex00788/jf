import { Component } from '@angular/core';
import {ModalService} from "../../shared/services/modal.service";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {Subject, takeUntil} from "rxjs";
import {ApiService} from "../../shared/services/api.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-reg-form-new-org',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './reg-form-new-org.component.html',
  styleUrl: './reg-form-new-org.component.css'
})
export class RegFormNewOrgComponent {
  constructor(
              public modalService: ModalService,
              private apiService: ApiService,
              private router: Router,
  ) {}
  private destroyed$: Subject<void> = new Subject();
  form = new FormGroup({
    nameSupervisor: new FormControl(null, Validators.required),
    phoneNumber: new FormControl(null, Validators.required),
    nameSectionOrOrganization: new FormControl(null, Validators.required),
  })



  submit() {
    this.form.disable()
    if (this.form.invalid) {
      return;
    }

    this.apiService.addNewOrgSend(this.form.value)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(() => {
          this.form.reset();
          this.router.navigate(['/']);
          this.modalService.close();
      })
  }
}
