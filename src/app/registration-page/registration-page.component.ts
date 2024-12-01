import { Component } from '@angular/core';
import { CheckboxModule } from 'primeng/checkbox';
import { StyleClassModule } from 'primeng/styleclass'; 
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ApiUsersService } from "../api-services/users/api-users.service";

@Component({
  selector: 'app-registration-page',
  standalone: true,
  imports: [
    CheckboxModule, StyleClassModule,
    ButtonModule, InputTextModule
  ],
  templateUrl: './registration-page.component.html',
  styleUrl: './registration-page.component.scss',
})

export class RegistrationPageComponent {
  constructor(private apiUsersService: ApiUsersService) { }
  
  getAll() {
    this.apiUsersService.getAll().subscribe(res => console.log(res));
  }
}