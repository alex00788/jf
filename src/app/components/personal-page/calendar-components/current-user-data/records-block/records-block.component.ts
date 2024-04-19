import {Component, OnInit} from '@angular/core';
import {PersonalBlockService} from "../../personal-block.service";
import {DateService} from "../../date.service";
import {TranslateMonthPipe} from "../../../../../shared/pipe/translate-month.pipe";
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";
import {Subject, takeUntil} from "rxjs";
import {ApiService} from "../../../../../shared/services/api.service";
import {DataCalendarService} from "../../data-calendar-new/data-calendar.service";
import moment from "moment/moment";

@Component({
  selector: 'app-records-block',
  standalone: true,
  imports: [
    TranslateMonthPipe,
    NgForOf,
    NgIf,
    AsyncPipe
  ],
  templateUrl: './records-block.component.html',
  styleUrl: './records-block.component.css'
})
export class RecordsBlockComponent implements OnInit{
  constructor(
    public personalBlockService: PersonalBlockService,
    public dateService: DateService,
    public dataCalendarService: DataCalendarService,
    public apiService: ApiService,
  ) {}
  private destroyed$: Subject<void> = new Subject();
  clickCount = 0;
  blockRepeat: boolean = false;
  currentDate: any;
  currentHour: any = new Date().getHours();



  ngOnInit(): void {
    this.currentDate = moment().format('DD.MM.YYYY');
    this.recordingDaysChanged();
  }

  // функция обновляет блок показывающий когда записан пользователь...как только пользователь запишется или отпишется
  recordingDaysChanged() {
    this.dateService.recordingDaysChanged
      .pipe(takeUntil(this.destroyed$))
      .subscribe(()=>{
        setTimeout(()=> {
          const allEntryCurUser = this.dataCalendarService.allEntryAllUsersInMonth.value
            .filter((entry: any)=> entry.userId == this.dateService.currentUserId.value)
          this.dateService.allEntryCurUserInSelectMonth.next(allEntryCurUser)
        }, 50)
      })
  }



  //удаление записи ...в блоке всех записей ...
  deleteSelectedRec(selectedRec: any) {
    this.blockRepeat = true;
    this.clickCount++;
    setTimeout(() => {
      if (this.clickCount === 1) {
        this.dataCalendarService.deleteSelectedRecInAllRecBlock(selectedRec);
      } else if (this.clickCount === 2) {
        return
      }
      this.clickCount = 0;
      this.blockRepeat = false;
    }, 250)
  }



}
