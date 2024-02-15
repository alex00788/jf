import { Routes } from '@angular/router';
import {MainPageComponent} from "./components/main-page/main-page.component";
import {PersonalPageComponent} from "./components/personal-page/personal-page.component";
import {AuthGuard} from "./shared/services/authGuard";

export const routes: Routes = [
  {path: '', component: MainPageComponent, pathMatch: 'full'},
  {path: 'personal-page', component: PersonalPageComponent, canActivate: [AuthGuard]},
];
