import {Component, OnInit} from '@angular/core';
import {AsyncPipe, CommonModule, NgIf} from "@angular/common";
import {ModalPageComponent} from "../modal-page/modal-page.component";
import {ModalService} from "../../services/modal.service";

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [
    ModalPageComponent,
    NgIf,
    AsyncPipe,
    CommonModule
  ],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.css'
})

export class MainPageComponent implements OnInit{
  title = 'Твой Личный Администратор'

  constructor(
    public modalService : ModalService
  ) {
  }

  ngOnInit(): void {
  }

  openModal() {
    this.modalService.open()
    this.modalService.hideTitle()

  }
}
