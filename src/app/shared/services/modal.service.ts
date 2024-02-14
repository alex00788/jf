import {Injectable} from "@angular/core";
import {BehaviorSubject} from "rxjs";

@Injectable({providedIn: "root"})
export class ModalService {
  isVisible$ = new BehaviorSubject<boolean>(false)
  hideTitle$ = new BehaviorSubject<boolean>(true)
  registrationForm$ = new BehaviorSubject<boolean>(false)
  loginForm$ = new BehaviorSubject<boolean>(false)

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
    this.registrationForm$.next(true)
    this.loginForm$.next(false)
  }

  openLoginForm$ () {
    this.registrationForm$.next(false)
    this.loginForm$.next(true)
  }

}
