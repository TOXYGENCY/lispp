import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// В этом сервисе мы работаем с пользователями.
// Отправляем запросы HTTP на адрес бекэнда (в контроллер php) и принимаем их оттуда
@Injectable({ providedIn: 'root' })
export class ApiUsersService {
  // private apiUrl = 'http://localhost/api';
  // Мой готовый бэкенд от другого проекта - для теста
  private apiUrl = 'https://localhost:7150/api/v1';

  constructor(private http: HttpClient) { }

  // Observable, потому что это аналог Task - асинхронный контейнер метода, который можно ожидать
  getAll(): Observable<any> {
    return this.http.get(`${this.apiUrl}/users`);
  }

  // sendData(data: any): Observable<any> {
  //   return this.http.post(`${this.apiUrl}/index.php`, data);
  // }
}