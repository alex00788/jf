import { Component } from '@angular/core';
import {ModalService} from "../../shared/services/modal.service";
import {ErrorModalComponent} from "../error-modal/error-modal.component";
import {AsyncPipe} from "@angular/common";

@Component({
  selector: 'app-modal-page',
  standalone: true,
  imports: [
    ErrorModalComponent,
    AsyncPipe,
  ],
  templateUrl: './modal-page.component.html',
  styleUrl: './modal-page.component.css'
})
export class ModalPageComponent {
  constructor(
    public modalService : ModalService,
  ) {
  }

}
