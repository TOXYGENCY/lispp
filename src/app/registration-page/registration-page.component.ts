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
  userType: string = '';
  adminCode: string = '';
  grade: string = '';
  orgCode: string = '';

  ShowHint(state: boolean, text: string = "") {
    this.hintText = text !== '' ? text : this.hintText;
    this.showErrorHint = state;
  }


  onInputChange() {
    if (this.email !== '' && this.passwordString !== '') {
      this.ShowHint(false);
    }
  }

  Authenticate() {
    if (this.isAuth) {
      if (this.email === '' || this.passwordString === '') {
        this.ShowHint(true, "Введите логин и пароль");
        return;
      }

      const credentials = {
        email: this.email,
        passwordString: this.passwordString
      };

      this.showLoading = true;

      this.apiUsersService.Authenticate(credentials).subscribe(
        response => {
          if (response) {
            // Перенаправление, все дела
            console.log(response);
          } else {
            this.ShowHint(true, "Неверный пароль"); // При неверном логине показывается error с сообщением из бекенда
            console.log(response);
          }
          this.showLoading = false;
        },

        error => {
          console.error(error);
          this.ShowHint(true, error.error);
          this.showLoading = false;
        }
      );
    }
  }

  Register() {
    if (this.email === '' || this.passwordString === '' || this.name === '' || this.password2 === '') {
      this.ShowHint(true, "Заполните все поля.");
      return;
    }

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
      },

      error => {
        console.error(error);
        this.ShowHint(true, error.error);
        this.showLoading = false;
      }
    );
  }
  Submit() {
    if (this.isAuth) {
      this.Authenticate();
    } else {
      this.Register();
    }
  }

}