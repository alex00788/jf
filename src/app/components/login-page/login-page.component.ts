import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgIf} from "@angular/common";
import {ModalPageComponent} from "../modal-page/modal-page.component";
import {ApiService} from "../../shared/services/api.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ErrorResponseService} from "../../shared/services/error.response.service";
import {Subject, takeUntil} from "rxjs";
import {ModalService} from "../../shared/services/modal.service";

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NgIf,
    ModalPageComponent,
  ],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})
export class LoginPageComponent implements OnInit, OnDestroy {
  title = 'вход в личный кабинет';
  inputPass: any;
  changeIcon = true;
  loginSub: any;
  private destroyed$: Subject<void> = new Subject();
  form = new FormGroup({
    phoneNumber: new FormControl(null),
    email: new FormControl(null, Validators.required),
    password: new FormControl(null, Validators.required),
  })

  constructor(
    private apiService: ApiService,
    private router: Router,
    private activateRouter: ActivatedRoute,
    private modalService: ModalService,
    public errorResponseService: ErrorResponseService
  ) {
  }

  ngOnInit(): void {
    this.errorResponseService.disableLoginForm
      .pipe(takeUntil(this.destroyed$))
      .subscribe(res =>
        res ? this.form.disable() : this.form.enable())
    this.activateRouter.queryParams
      .pipe(takeUntil(this.destroyed$))
      .subscribe(params => {
        console.log('40 queryparams', params)
      })
  }

  get phoneNumber() {
    return this.form.controls.phoneNumber as FormControl
  }

  get email() {
    return this.form.controls.email as FormControl
  }

  get password() {
    return this.form.controls.password as FormControl
  }


  submit() {
    // в зависимости от введеных данных присваиваеться роль и рисуеться интерфейс!!!
    this.form.disable()          //блокировка формы чтоб не отправлять много запросов подряд
    if (this.form.invalid) {
      return;
    }
    this.loginSub = this.apiService.login(this.form.value).subscribe(userData => {
      if (userData) {
        this.form.reset()
        this.router.navigate(['personal-page'])
      }
    })
  }


  showOrHidePassword() {
    this.inputPass = document.getElementById('password');
    if (this.inputPass?.getAttribute('type') === 'password') {
      this.changeIcon = false;
      this.inputPass.setAttribute('type', 'text');
    } else {
      this.inputPass.setAttribute('type', 'password');
      this.changeIcon = true;
    }
  }

  ngOnDestroy(): void {
    if (this.loginSub) {
      this.loginSub.unsubscribe();
    }
  }

  openRegistrationPage() {
    this.modalService.openRegistrationForm$();
  }
}
