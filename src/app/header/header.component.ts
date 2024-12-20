import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api/menuitem';
import { MenubarModule } from 'primeng/menubar';
import { ApiUsersService } from '../api-services/users/api-users.service';
import { User } from '../domain-models/User';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MenubarModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  constructor(private apiUsersService: ApiUsersService) { }
  
  items: MenuItem[] = [];
  _currentUser: User | null = null;

  ngOnInit(): void {
    this._currentUser = this.apiUsersService.GetCurrentUser();

    this.items = [
      { label: "Главы", routerLink: "/chapters" },
      { label: "Итоговый тест", routerLink: "/test" },
      { label: "Вход", routerLink: "/login" }
    ];

    if (this._currentUser?.user_type !== 1) {
      this.items.push(
        { label: "Управление тестами", routerLink: "/editor/test" },
        { label: "Управление материалами", routerLink: "/editor/chapter" },
        { label: "Результаты учеников", routerLink: "/results" }
      )
    }
  }
}
