import {Injectable} from "@angular/core";
import {BehaviorSubject} from "rxjs";

@Injectable({providedIn: "root"})
export class ModalService {
  isVisible$ = new BehaviorSubject<boolean>(false)
  hideTitle$ = new BehaviorSubject<boolean>(true)

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
}
