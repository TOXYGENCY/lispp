import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of, switchMap, tap } from 'rxjs';
import { apiUrl, test_apiUrl } from '../../app.config';
import { User } from '../../domain-models/User';

// В этом сервисе мы работаем с пользователями.
// Отправляем запросы HTTP на адрес бекэнда (в контроллер php) и принимаем их оттуда
@Injectable({ providedIn: 'root' })
export class ApiUsersService {
  private apiUrl = apiUrl;
  private _currentUser: User | null = null;

  constructor(private http: HttpClient) {
    this._LoadCurrentUserFromStorage();
  }

  // Сохранение пользователя в sessionStorage
  SetCurrentUser(user: User | null): void {
    this._currentUser = user;
    sessionStorage.setItem('CurrentUser', JSON.stringify(user));
  }

  // Загрузка пользователя из sessionStorage
  private _LoadCurrentUserFromStorage(): void {
    const userJson = sessionStorage.getItem('CurrentUser');
    if (userJson) {
      this._currentUser = JSON.parse(userJson);
    }
  }

  GetCurrentUser(): User | null {
    return this._currentUser;
  }

  // Observable, потому что это аналог Task - асинхронный контейнер метода, который можно ожидать
  GetAll(): Observable<any> {
    return this.http.get(`${this.apiUrl}/users`);
  }

  GetUserById(id: string): Observable<User | null> {
    return this.http.get<User>(`${this.apiUrl}/users/${id}`).pipe(
      map(user => {
        // Если пользователь не найден, возвращаем null
        if (!user) {
          return null;
        }
        return user;
      }),
      catchError(() => {
        // В случае ошибки (например, если пользователь не найден), возвращаем null
        return of(null);
      })
    );
  }

  GetUserByEmail(email: string): Observable<User | null> {
    return this.http.get<User>(`${this.apiUrl}/users/email/${email}`).pipe(
      map(user => {
        // Если пользователь не найден, возвращаем null
        if (!user) {
          return null;
        }
        return user;
      }),
      catchError(() => {
        // В случае ошибки (например, если пользователь не найден), возвращаем null
        return of(null);
      })
    );
  }

  Authenticate(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/auth`, credentials);
  }

  Register(User: User): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/register`, User);
  }

  AuthenticateAndSetCurrentUser(credentials: any): Observable<User | null> {
    return this.Authenticate(credentials).pipe(
      switchMap(response => {
        if (response) {
          return this.GetUserByEmail(credentials['email']).pipe(
            tap(user => {
              this.SetCurrentUser(user); // Устанавливаем текущего пользователя
            })
          );
        } else {
          return of(null); // Если аутентификация не удалась, возвращаем null
        }
      }),
      catchError(() => {
        return of(null); // Обработка ошибок
      })
    );
  }

  RegisterAndSetCurrentUser(User: User): Observable<User | null> {
    return this.Register(User).pipe(
      switchMap(response => {
        if (response) {
          return this.GetUserByEmail(User['email']).pipe(
            tap(user => {
              this.SetCurrentUser(user); // Устанавливаем текущего пользователя
            })
          );
        } else {
          return of(null); // Если аутентификация не удалась, возвращаем null
        }
      }),
      catchError(() => {
        return of(null); // Обработка ошибок
      })
    );
  }

}