import { Component } from '@angular/core';
import { CheckboxModule } from 'primeng/checkbox';
import { StyleClassModule } from 'primeng/styleclass';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ApiUsersService } from "../api-services/users/api-users.service";
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { fullTitleRu } from '../app.config';
import { User } from '../domain-models/User';
import { Router } from '@angular/router';


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
  constructor(private apiUsersService: ApiUsersService, private router: Router) { }

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
  loginRedirect: any = ['/chapters'];

  ShowHint(state: boolean, text: string = "") {
    this.hintText = text !== '' ? text : this.hintText;
    this.showErrorHint = state;
  }


  onInputChange() {
    this.ShowHint(false);
  }

  VerifyForm(): boolean {
    let result: boolean = true;

    if (this.isAuth) {
      // Проверка на заполнение нужных полей входа
      if (!this.userType || !this.email || !this.passwordString || (this.userType === '3' && !this.adminCode)) {
        this.ShowHint(true, "Заполните все поля.");
        result = false;
      }
    } else {
      // Проверка на заполнение нужных полей регистрации
      if (!this.email || !this.passwordString ||
        !this.name || !this.password2 ||
        this.userType === '' ||
        ((this.userType === '3' && !this.adminCode ||
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
    const Credentials = {
      email: this.email.toLowerCase(),
      passwordString: this.passwordString,
      userType: this.userType,
      adminCode: this.adminCode
    };

    this.apiUsersService.AuthenticateAndSetCurrentUser(Credentials).subscribe(
      response => {
        if (response) {
          this.router.navigate(this.loginRedirect);
          console.log(response);
        } else {
          this.ShowHint(true, "Неверный логин или пароль");
          console.log(response);
        }
        this.showLoading = false;
        this.disableSubmit = false;
      },

      error => {
        console.error(error.message);
        console.error(error);
        console.error(error.error);
        this.ShowHint(true, "Ошибка сервиса. Поробуйте позже.");
        this.showLoading = false;
        this.disableSubmit = false;
      }
    );

  }

  Register() {
    const NewUser: User = {
      name: this.name,
      email: this.email.toLowerCase(),
      password: this.passwordString,
      userType: Number(this.userType),
      orgCode: this.orgCode
    };

    this.apiUsersService.RegisterAndSetCurrentUser(NewUser).subscribe(
      response => {
        if (response) {
          // Перенаправление, все дела
          this.router.navigate(this.loginRedirect);
        } else {
          this.ShowHint(true, "Не удалось создать пользователя. Такой E-mail уже есть или неверный код организации.");
          console.log(response);
        }
        console.log(response);
        this.showLoading = false;
        this.disableSubmit = false;
      },

      error => {
        console.error(error.message);
        console.error(error);
        console.error(error.error);
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