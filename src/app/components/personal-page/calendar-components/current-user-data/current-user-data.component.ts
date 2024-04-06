import {Component} from '@angular/core';
import {DateService} from "../date.service";
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";
import {ReactiveFormsModule} from "@angular/forms";
import {ApiService} from "../../../../shared/services/api.service";
import {TranslateMonthPipe} from "../../../../shared/pipe/translate-month.pipe";
import {PersonalBlockService} from "../personal-block.service";
import {PersonalDataBlockComponent} from "./personal-data-block/personal-data-block.component";
import {RecordsBlockComponent} from "./records-block/records-block.component";
import {AddNewOrgComponent} from "./add-new-org/add-new-org.component";
import {SettingsBlockComponent} from "./settings-block/settings-block.component";
import {SelectOrgToDisplayComponent} from "./select-org-to-display/select-org-to-display.component";

@Component({
  selector: 'app-current-user-data',
  standalone: true,
  imports: [
    AsyncPipe,
    ReactiveFormsModule,
    NgForOf,
    NgIf,
    TranslateMonthPipe,
    PersonalDataBlockComponent,
    RecordsBlockComponent,
    AddNewOrgComponent,
    SettingsBlockComponent,
    SelectOrgToDisplayComponent
  ],
  templateUrl: './current-user-data.component.html',
  styleUrl: './current-user-data.component.css'
})
export class CurrentUserDataComponent {
  constructor(
    public dateService: DateService,
    public apiService: ApiService,
    public personalBlockService: PersonalBlockService,
  ) {}
  dataSettings:  any;


}
