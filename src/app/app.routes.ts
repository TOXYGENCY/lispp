import { Routes } from '@angular/router';
import { RegistrationPageComponent } from './registration-page/registration-page.component';
import { ChaptersPageComponent } from './chapters-page/chapters-page.component';

export const routes: Routes = [
    { path: '', component: RegistrationPageComponent },
    { path: 'login', component: RegistrationPageComponent },
    { path: 'register', component: RegistrationPageComponent }, 
    { path: 'home', component: RegistrationPageComponent }, 
    { path: 'chapters', component: ChaptersPageComponent }, // Страница глав
    { path: '**', redirectTo: '' } // Перенаправление на логин для несуществующих маршрутов
];
