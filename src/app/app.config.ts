import { ApplicationConfig } from '@angular/core';
import { provideHttpClient } from '@angular/common/http'
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideHttpClient()]
};

export const test_apiUrl: string = 'https://localhost:7150/api/v1';
export const apiUrl: string = 'http://localhost/api';

export const extraShortTitleEn: string = 'LISPP';
export const shortTitleEn: string = 'Python Practice';
export const fullProjectTitleEn: string = 'Learning Information System Python Practice';

export const extraShortTitleRu: string = 'ОИСПП';
export const shortTitleRu: string = 'Практика Python';
export const shortTitleRu2: string = 'Информационная Система';
export const fullTitleRu: string = 'Обучающая Информационная Система по Python';
export const fullProjectTitleRu: string = 'Обучающая Информационная Система Практики по Python для 8-9 классов';