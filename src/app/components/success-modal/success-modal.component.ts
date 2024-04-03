import { Component } from '@angular/core';
import {AsyncPipe, NgIf} from "@angular/common";
import {SuccessService} from "../../shared/services/success.service";

@Component({
  selector: 'app-success-modal',
  standalone: true,
  imports: [
    AsyncPipe,
    NgIf
  ],
  templateUrl: './success-modal.component.html',
  styleUrl: './success-modal.component.css'
})
export class SuccessModalComponent {
  constructor(public successService: SuccessService) {
  }

  closeSuccess() {
      this.successService.clear();
  }
}
