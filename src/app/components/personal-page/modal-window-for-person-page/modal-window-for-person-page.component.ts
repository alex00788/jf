import { Component } from '@angular/core';
import {ModalService} from "../../../shared/services/modal.service";

@Component({
  selector: 'app-modal-window-for-person-page',
  standalone: true,
  imports: [],
  templateUrl: './modal-window-for-person-page.component.html',
  styleUrl: './modal-window-for-person-page.component.css'
})
export class ModalWindowForPersonPageComponent {
constructor(public modalService : ModalService,) {
}
}
