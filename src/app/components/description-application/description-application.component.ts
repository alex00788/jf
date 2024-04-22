import { Component } from '@angular/core';
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-description-application',
  standalone: true,
  imports: [
    NgIf
  ],
  templateUrl: './description-application.component.html',
  styleUrl: './description-application.component.css'
})
export class DescriptionApplicationComponent {
  howItWorkBlock: boolean = false;
  forWhomBlock: boolean = false;
  whyDoYouNeedThis: boolean = false;
  blockDescription =  false;

  switchHowItWorkBlock() {
    this.howItWorkBlock = !this.howItWorkBlock;
    this.forWhomBlock = false;
    this.whyDoYouNeedThis = false;
  }

  switchForWhomBlock() {
    this.howItWorkBlock = false;
    this.forWhomBlock = !this.forWhomBlock;
    this.whyDoYouNeedThis = false;
  }

  switchWhyDoYouNeedThis() {
    this.howItWorkBlock = false;
    this.forWhomBlock = false;
    this.whyDoYouNeedThis = !this.whyDoYouNeedThis;
  }

  changeVisible() {
    this.blockDescription = !this.blockDescription;
  }
}
