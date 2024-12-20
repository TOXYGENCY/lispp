import { Component, OnInit, ViewChild } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TabMenu, TabMenuModule } from 'primeng/tabmenu';
import { MenuItem } from 'primeng/api/menuitem';


@Component({
  selector: 'app-editor-page',
  standalone: true,
  imports: [HeaderComponent, RouterOutlet, CommonModule,
    ProgressSpinnerModule, TabMenuModule,
  ],
  templateUrl: './editor-page.component.html',
  styleUrl: './editor-page.component.scss'
})


export class EditorPageComponent implements OnInit {
  @ViewChild(RouterOutlet) routerOutlet!: RouterOutlet;
  currentPath: string;
  pageTitle: string = "Управление материалами";
  pageSubTitle: string = "Выберите тип материала для редактирования.";
  isLoading: boolean = false;
  tabs: MenuItem[] | undefined;
  activeTab: MenuItem | undefined;

  constructor(private router: Router) {
    // Получаем текущее значение маршрута при инициализации компонента
    this.currentPath = this.router.url;

    // Подписываемся на события навигации для обновления пути при изменении URL
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.currentPath = this.router.url;
    });
  }
  ngAfterViewInit() {
    console.log(this.routerOutlet); // Проверьте, что routerOutlet инициализирован
  }
  // Геттер для проверки активации маршрута
  get isRouterActive(): boolean {
    return this.routerOutlet ? this.routerOutlet.isActivated : false;
  }

  ngOnInit(): void {
    this.tabs = [
      { label: 'Главы', route: ['chapter'] },
      { label: 'Блоки', route: ['block'] },
      { label: 'Параграфы', route: ['paragraph'] },
      { label: 'Тесты', route: ['test'] }
    ];
    this.activeTab = this.tabs[0];

  }


}
