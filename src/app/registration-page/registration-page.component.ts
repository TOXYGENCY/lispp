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
  user_type: string = "";
  adminCode: string = '';
  organization_code: string = '';
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
      if (!this.user_type || !this.email || !this.passwordString || (this.user_type === '3' && !this.adminCode)) {
        this.ShowHint(true, "Заполните все поля.");
        result = false;
      }
    } else {
      // Проверка на заполнение нужных полей регистрации
      if (!this.email || !this.passwordString ||
        !this.name || !this.password2 ||
        this.user_type === '' ||
        ((this.user_type === '3' && !this.adminCode ||
          (this.user_type === '1' || this.user_type === '2')
          && !this.organization_code)
        )
      ) {
        this.ShowHint(true, "Заполните все поля.");
        result = false;
      }

      if (this.passwordString !== this.password2) {
        this.ShowHint(true, "Пароли не совпадают.");
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
      user_type: this.user_type,
      adminCode: this.adminCode
    };

    this.apiUsersService.AuthenticateAndSetCurrentUser(Credentials).subscribe(
      (response: any) => { // Сюда приходит ответ из api AuthenticateAndSetCurrentUser в виде {user?: User, message?: string}
        if (response.user) {
          // Перенаправление, все дела
          this.router.navigate(this.loginRedirect);
        } else {
          this.ShowHint(true, response.message);
        }
        console.log(response);
        this.showLoading = false;
        this.disableSubmit = false;
      },

      error => {
        console.error(error.message);
        console.error(error);
        console.error(error.error);
        this.ShowHint(true, "Ошибка сервиса (код 500). Поробуйте позже.");
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
      user_type: Number(this.user_type),
      organization_code: this.organization_code
    };
    // console.log(NewUser);


    this.apiUsersService.RegisterAndSetCurrentUser(NewUser).subscribe(
      (response: any) => { // Сюда приходит ответ из api RegisterAndSetCurrentUser в виде {user?: User, message?: string}
        if (response.user) {
          // Перенаправление, все дела
          this.router.navigate(this.loginRedirect);
        } else {
          this.ShowHint(true, response.message);
        }
        console.log(response);
        this.showLoading = false;
        this.disableSubmit = false;
      },

      error => {
        console.error(error.message);
        console.error(error);
        console.error(error.error);
        this.ShowHint(true, "Ошибка сервиса (код 500). Поробуйте позже.");
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