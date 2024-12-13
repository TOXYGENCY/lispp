import { Component } from '@angular/core';
import { CheckboxModule } from 'primeng/checkbox';
import { StyleClassModule } from 'primeng/styleclass';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ApiUsersService } from "../api-services/users/api-users.service";
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { fullTitleRu } from '../app.config';


@Component({
  selector: 'app-registration-page',
  standalone: true,
  imports: [
    CheckboxModule, StyleClassModule,
    ButtonModule, InputTextModule, FormsModule,
    CommonModule,
  ],
  templateUrl: './registration-page.component.html',
  styleUrl: './registration-page.component.scss',
})

export class RegistrationPageComponent {
  constructor(private apiUsersService: ApiUsersService) { }

  showErrorHint: boolean = false;
  showLoading: boolean = false;
  isAuth: boolean = true;
  name: string = '';
  email: string = '';
  password2: string = '';
  passwordString: string = '';
  submitLabel: string = 'Подтвердить';
  fullTitleRu: string = fullTitleRu;
  hintText: string = 'Введите логин и пароль';
  userType: string = "";
  adminCode: string = '';
  orgCode: string = '';
  disableSubmit: boolean = false;

  ShowHint(state: boolean, text: string = "") {
    this.hintText = text !== '' ? text : this.hintText;
    this.showErrorHint = state;
  }


  onInputChange() {
    this.ShowHint(false);
  }

  VerifyAdminCode() { // TODO: сделать проверку на админский код
  }

  VerifyOrgCode() { // TODO: сделать проверку на организационный код
  }

  VerifyForm(): boolean {
    let result: boolean = true;
    
    if (this.isAuth) {
      if (this.email === '' || this.passwordString === '') {
        this.ShowHint(true, "Введите логин и пароль");
        result = false;
      }
    } else {
      // Проверка на заполнение нужных полей
      if (!this.email || !this.passwordString || 
        !this.name || !this.password2 || 
        !this.userType || 
        (!this.isAuth && 
            (this.userType === '3' && !this.adminCode || 
                (this.userType === '1' || this.userType === '2') 
            && !this.orgCode)
        )
      ) {
        this.ShowHint(true, "Заполните все поля.");
        result = false;
      }
    }
    this.disableSubmit = false;
    return result;
  }

  Authenticate() {
    const credentials = {
      email: this.email,
      passwordString: this.passwordString
    };

    this.apiUsersService.Authenticate(credentials).subscribe(
      response => {
        if (response) {
          // Перенаправление, все дела
          console.log(response);
        } else {
          this.ShowHint(true, "Неверный логин или пароль");
          console.log(response);
        }
        this.showLoading = false;
        this.disableSubmit = false;
      },

      error => {
        console.error(error);
        this.ShowHint(true, "Ошибка сервиса. Поробуйте позже.");
        this.showLoading = false;
        this.disableSubmit = false;
      }
    );

  }

  Register() {
    const credentials = {
      name: this.name,
      email: this.email,
      passwordString: this.passwordString
    };

    this.apiUsersService.Register(credentials).subscribe(
      response => {
        // Перенаправление, все дела
        console.log(response);
        this.showLoading = false;
        this.disableSubmit = false;
      },

      error => {
        console.error(error);
        this.ShowHint(true, "Ошибка сервиса. Поробуйте позже.");
        this.showLoading = false;
        this.disableSubmit = false;
      }
    );
  }

  Submit() {
    this.disableSubmit = true;
    this.ShowHint(false);
    if (!this.VerifyForm()) {
      return;
    }
    if (this.isAuth) {
      this.showLoading = true;
      this.Authenticate();
      this.disableSubmit = true;
    } else {
      this.showLoading = true;
      this.Register();
      this.disableSubmit = true;
    }
  }
}