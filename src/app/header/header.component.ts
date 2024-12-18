import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api/menuitem';
import { MenubarModule } from 'primeng/menubar';
import { ApiUsersService } from '../api-services/users/api-users.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MenubarModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  
  constructor(private apiUsersService: ApiUsersService) {}
  items = [
    { label: "Содержание" },
    { label: "Итоговый тест" }
  ];
  
  ngOnInit(): void {
    const currentUser = this.apiUsersService.GetCurrentUser();
    // TODO: решить вопрос с null и проверкой на логин
    if (currentUser?.user_type !== 1) {
      this.items.push(
        { label: "Управление тестами" }, 
        { label: "Управление материалами" }, 
        { label: "Результаты учеников" }
      )
    }
  }
}
