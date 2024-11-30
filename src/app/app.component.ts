import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
// import { BrowserModule } from '@angular/platform-browser';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RegistrationPageComponent } from './registration-page/registration-page.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, 
    // BrowserModule, BrowserAnimationsModule, 
    RegistrationPageComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'LISPP';
}
