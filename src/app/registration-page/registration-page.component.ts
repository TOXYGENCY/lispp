import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CheckboxModule } from 'primeng/checkbox';
import { StyleClassModule } from 'primeng/styleclass';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ApiUsersService } from "../api-services/users/api-users.service";
import { FormControl, FormGroup, FormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { fullTitleRu } from '../app.config';
import { User } from '../domain-models/User';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { SelectButtonModule } from 'primeng/selectbutton';
import { RouterOutlet } from '@angular/router';



@Component({
  selector: 'app-registration-page',
  standalone: true,
  imports: [
    CheckboxModule, StyleClassModule,
    ButtonModule, InputTextModule, FormsModule,
    CommonModule, ReactiveFormsModule,
    SelectButtonModule, RouterOutlet 
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
  hintText: string = 'Неизвестная ошибка';
  user_type: number = 0;
  user_types: any[] = [
    { type: 'Ученик', value: 1 },
    { type: 'Преподаватель', value: 2 },
    { type: 'Администратор', value: 3 }
  ];
  adminCode: string = '';
  organization_code: string = '';
  disableSubmit: boolean = false;
  loginRedirect: any = ['/chapters'];
  emailValidator: FormControl = new FormControl('', [
    Validators.required,
    Validators.email
  ]);

  UpdateUserTypes() {
    if (!this.isAuth) {
      this.user_types = [
        { type: 'Ученик', value: 1 },
        { type: 'Преподаватель', value: 2 }
      ];
    } else {
      this.user_types = [
        { type: 'Ученик', value: 1 },
        { type: 'Преподаватель', value: 2 },
        { type: 'Администратор', value: 3 }
      ];
    }
  }

  ShowHint(state: boolean, text: string = "") {
    if (state == true && text == '') {
      console.warn("Hint text argument empty: ", text);
      this.hintText = "Неизвестная ошибка";
    } else {
      this.hintText = text;
    }
    this.showErrorHint = state;
  }

  onInputChange() {
    this.ShowHint(false);
  }

  VerifyForm(): boolean {
    let result: boolean = true;

    if (this.emailValidator && this.emailValidator.invalid) {
      this.ShowHint(true, "Введите корректный email.");
      result = false;
    }

    if (this.isAuth) {
      // Проверка на заполнение нужных полей входа
      if (!this.user_type || !this.email || !this.passwordString || (this.user_type === 3 && !this.adminCode)) {
        this.ShowHint(true, "Заполните все поля.");
        result = false;
      }
    } else {
      // Проверка на заполнение нужных полей регистрации
      if (!this.email || !this.passwordString ||
        !this.name || !this.password2 ||
        this.user_type === 0 ||
        ((this.user_type === 3 && !this.adminCode ||
          (this.user_type === 1 || this.user_type === 2)
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

    this.apiUsersService.AuthenticateAndToSession(Credentials).subscribe(
      (response: any) => { // Сюда приходит ответ из api AuthenticateAndToSession в виде {success?: boolean, message?: string}
        console.log("Authenticate() got from AuthenticateAndToSession: ", response);
        if (response.success) {
          // Перенаправление, все дела
          this.router.navigate(this.loginRedirect);
        } else {
          // console.log(response.status != 0 && response.message != null);

          this.ShowHint(true, response.status != 0 && response.message != null ? response.message : "Ошибка сервиса (код 500). Поробуйте позже.");
        }
        this.showLoading = false;
        this.disableSubmit = false;
      },

      (error: any) => {
        console.error(error.message);
        console.error(error);
        console.error(error.error);
        this.ShowHint(true, "Ошибка сервиса (код 500). Поробуйте позже.");
        this.showLoading = false;
        this.disableSubmit = false;
      });

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


    this.apiUsersService.RegisterAndToSession(NewUser).subscribe(
      (response: any) => { // Сюда приходит ответ из api RegisterAndToSession в виде {user?: User, message?: string}
        if (response.user) {
          // Перенаправление, все дела
          this.router.navigate(this.loginRedirect);
        } else {
          this.ShowHint(true, response.status != 0 && response.message ? response.message : "Ошибка сервиса (код 500). Поробуйте позже.");
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