import { Component, OnInit, ViewChild } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TabMenu, TabMenuModule } from 'primeng/tabmenu';
import { MenuItem } from 'primeng/api/menuitem';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';


@Component({
  selector: 'app-editor-page',
  standalone: true,
  imports: [HeaderComponent, RouterOutlet, CommonModule,
    ProgressSpinnerModule, TabMenuModule, ToastModule
  ],
  providers: [MessageService],
  templateUrl: './editor-page.component.html',
  styleUrl: './editor-page.component.scss'
})


export class EditorPageComponent implements OnInit {
  @ViewChild(RouterOutlet) routerOutlet!: RouterOutlet;
  pageTitle: string = "Управление материалами";
  pageSubTitle: string = "Выберите тип материала для редактирования.";
  isLoading: boolean = false;
  tabs: MenuItem[] | undefined;
  activeTab: MenuItem | undefined;

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {}

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

  }

}


