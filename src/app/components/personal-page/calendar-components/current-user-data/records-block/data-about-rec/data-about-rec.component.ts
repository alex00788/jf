import { Component } from '@angular/core';
import {DateService} from "../../../date.service";
import {AsyncPipe} from "@angular/common";

@Component({
  selector: 'app-data-about-rec',
  standalone: true,
  imports: [
    AsyncPipe
  ],
  templateUrl: './data-about-rec.component.html',
  styleUrl: './data-about-rec.component.css'
})
export class DataAboutRecComponent {
constructor(public dateService: DateService) {
}
}
