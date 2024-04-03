import { Injectable } from '@angular/core';
import {BehaviorSubject, Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SuccessService {

  constructor() { }


  success$ = new Subject<string>()
  disableLoginForm = new BehaviorSubject(false);


  localHandler(mes: string) {
    return this.success$.next(mes)
  }


  clear() {
    this.disableLoginForm.next(false)
    this.success$.next('')
  }

}
