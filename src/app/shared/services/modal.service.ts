import {Injectable} from "@angular/core";
import {BehaviorSubject} from "rxjs";

@Injectable({providedIn: "root"})
export class ModalService {
  isVisible$ = new BehaviorSubject<boolean>(false)
  hideTitle$ = new BehaviorSubject<boolean>(true)
  registrationForm$ = new BehaviorSubject<boolean>(false)
  loginForm$ = new BehaviorSubject<boolean>(false)
  appDescription$ = new BehaviorSubject<boolean>(false)

  open() {
    this.isVisible$.next(true)
  }

  close() {
    this.isVisible$.next(false)
    this.hideTitle$.next(true)
  }

  hideTitle() {
    this.hideTitle$.next(false)
  }

  showTitle() {
    this.hideTitle$.next(true)
  }

  openRegistrationForm$ () {
    this.registrationForm$.next(true);
    this.loginForm$.next(false);
    this.appDescription$.next(false);
  }

  openLoginForm$ () {
    this.registrationForm$.next(false);
    this.loginForm$.next(true);
    this.appDescription$.next(false);
  }


  openAppDescription$ () {
    this.open();
    this.appDescription$.next(true);
    this.registrationForm$.next(false);
    this.loginForm$.next(false);
    this.hideTitle$.next(false)
  }

  closeAppDescription$() {
    this.appDescription$.next(false);
  }

}
