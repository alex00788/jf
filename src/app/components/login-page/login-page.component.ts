import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgIf} from "@angular/common";
import {ModalPageComponent} from "../modal-page/modal-page.component";
import {ApiService} from "../../shared/services/api.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ErrorResponseService} from "../../shared/services/error.response.service";
import {Subject, takeUntil} from "rxjs";
import {ModalService} from "../../shared/services/modal.service";
import {DateService} from "../personal-page/calendar-components/date.service";
import {SuccessService} from "../../shared/services/success.service";

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
  title = 'Вход в личный кабинет';
  inputPass: any;
  accountNotConfirmed: boolean = false;
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
    private dateService: DateService,
    public successService: SuccessService,

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
        // console.log('40 queryparams', params)
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
    this.loginSub = this.apiService.login(this.form.value)
      .pipe(takeUntil(this.destroyed$))
      .subscribe(userData => {
        if (userData?.user.isActivated) {
        this.form.reset();
        this.router.navigate(['personal-page']);
        this.modalService.close();
        this.dateService.setUser(userData);
        this.accountNotConfirmed = true;
        this.dateService.currentOrg.next(userData)
      } else {
          this.errorResponseService.localHandler('активируйте аккаунт, пройдите по ссылке в почте...');
          this.accountNotConfirmed = true;
          this.router.navigate(['/']);
          this.apiService.logout();
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

  openRegistrationPage() { //  откроет форму регистрации
    this.modalService.openRegistrationForm$();
  }

  openRegFormChoiceOrg() {
    this.modalService.openRegFormChoiceOrganisation();
  }

  resendLink() {
    this.apiService.resendLink({email: this.form.value.email})
      .pipe(takeUntil(this.destroyed$))
      .subscribe((mes:any) => {
        this.errorResponseService.clear();
        this.modalService.close();
        this.successService.localHandler(mes.message)
        this.accountNotConfirmed = false;
      })
  }
}
