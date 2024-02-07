import { Component } from '@angular/core';
import {ErrorResponseService} from "../../shared/services/error.response.service";
import {AsyncPipe, NgIf} from "@angular/common";

@Component({
  selector: 'app-error-modal',
  standalone: true,
  imports: [
    AsyncPipe,
    NgIf
  ],
  templateUrl: './error-modal.component.html',
  styleUrl: './error-modal.component.css'
})
export class ErrorModalComponent {
  errMessage = 'Ошибка!'

constructor(
  public errorResponseService: ErrorResponseService
) {
}

  closeErr() {
    this.errorResponseService.clear();
  }
}
