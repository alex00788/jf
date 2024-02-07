import {Injectable} from "@angular/core";
import {BehaviorSubject, Subject} from "rxjs";

@Injectable({providedIn: "root"})

export class ErrorResponseService {
  error$ = new Subject<string>()
  disableLoginForm = new BehaviorSubject(false);

  handler(message: any) {
    this.disableLoginForm.next(true)
    return this.error$.next(message)
  }

  clear() {
    this.disableLoginForm.next(false)
    this.error$.next('')
  }

}
