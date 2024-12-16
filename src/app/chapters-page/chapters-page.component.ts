import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-chapters-page',
  standalone: true,
  imports: [HeaderComponent],
  templateUrl: './chapters-page.component.html',
  styleUrl: './chapters-page.component.scss'
})
export class ChaptersPageComponent {
  
}
