import { Routes } from '@angular/router';
import {MainPageComponent} from "./components/main-page/main-page.component";
import {PersonalPageComponent} from "./components/personal-page/personal-page.component";

export const routes: Routes = [
  {path: '', component: MainPageComponent, pathMatch: 'full'},
  {path: 'personal-page', component: PersonalPageComponent},
];
