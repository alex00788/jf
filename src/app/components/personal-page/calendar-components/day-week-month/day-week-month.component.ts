import { Component } from '@angular/core';
import {RecordingService} from "../recording.service";

@Component({
  selector: 'app-day-week-month',
  standalone: true,
  imports: [],
  templateUrl: './day-week-month.component.html',
  styleUrl: './day-week-month.component.css'
})
export class DayWeekMonthComponent {
constructor(public recordingService: RecordingService) {
}
}
