import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})
export class LoginPageComponent implements OnInit{
title = 'Твой Личный Администратор'
  form = new FormGroup({
    phoneNumber: new FormControl(null, Validators.required),
    password: new FormControl(null, Validators.required),
  })

  ngOnInit(): void {
  }
}
