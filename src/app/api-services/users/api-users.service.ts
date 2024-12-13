import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { apiUrl, test_apiUrl } from '../../app.config';

// В этом сервисе мы работаем с пользователями.
// Отправляем запросы HTTP на адрес бекэнда (в контроллер php) и принимаем их оттуда
@Injectable({ providedIn: 'root' })
export class ApiUsersService {
  private apiUrl = apiUrl;
  // private apiUrl = test_apiUrl;

  constructor(private http: HttpClient) { }

  // Observable, потому что это аналог Task - асинхронный контейнер метода, который можно ожидать
  GetAll(): Observable<any> {
    return this.http.get(`${this.apiUrl}/users`);
  }

  Authenticate(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/auth`, credentials);
  }

  Register(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/register`, credentials);
  }
}