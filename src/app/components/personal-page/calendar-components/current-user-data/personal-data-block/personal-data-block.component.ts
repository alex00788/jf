import {Component, OnInit} from '@angular/core';
import {PersonalBlockService} from "../../personal-block.service";
import {DateService} from "../../date.service";
import {AsyncPipe, NgIf} from "@angular/common";

@Component({
  selector: 'app-personal-data-block',
  standalone: true,
  imports: [
    AsyncPipe,
    NgIf
  ],
  templateUrl: './personal-data-block.component.html',
  styleUrl: './personal-data-block.component.css'
})
export class PersonalDataBlockComponent implements OnInit{
  constructor(
               public personalBlockService: PersonalBlockService,
               public dateService: DateService,
  ) {  }

  ngOnInit(): void {
    const currentUser = JSON.parse(localStorage.getItem('userData') as string)
    this.dateService.remainingFunds.next(currentUser.user.remainingFunds)
  }

}
