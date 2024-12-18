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
  public SetCurrentUser(user: User | null): void {
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

  public GetCurrentUser(): User | null {
    this._LoadCurrentUserFromStorage();
    return this._currentUser;
  }

  // Observable, потому что это аналог Task - асинхронный контейнер метода, который можно ожидать
  public GetAll(): Observable<any> {
    return this.http.get(`${this.apiUrl}/users`);
  }

  public GetUserById(id: string): Observable<User | null> {
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

  public GetUserByEmail(email: string): Observable<User | null> {
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

  // Основной метод регистрации - !вызывается из публичного AuthenticateAndSetCurrentUser
  private _Authenticate(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/auth`, credentials);
  }


  public AuthenticateAndSetCurrentUser(credentials: any): Observable<User | null> {
    return this._Authenticate(credentials).pipe(
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

  // Основной метод регистрации - вызывается из публичного RegisterAndSetCurrentUser
  private _Register(User: User): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/register`, User).pipe(
      tap(response => console.log('Response from _Register:', response)),

      map((response: any) => { // Сюда приходит ответ из PHP
        if (response.success) {
          return { user: response.user, message: null }; // В RegisterAndSetCurrentUser возвращаем пользователя, если регистрация успешна
        } else {
          throw new Error(response.message); // Генерируем ошибку в RegisterAndSetCurrentUser в catchError, если регистрация не удалась
        }
      }),

      catchError((error: any) => {
        console.error(error);
        return of({ user: null, message: error.message }); // В RegisterAndSetCurrentUser возвращаем объект с ошибкой из PHP и null
      })
    );
  }

  public RegisterAndSetCurrentUser(User: User): Observable<any> {
    return this._Register(User).pipe(

      switchMap(
        (response: any) => { // Сюда приходит ответ из _Register
          if (response.user) {
            console.log("REG SETTING USER: ", response.user);
            this.SetCurrentUser(response.user); // Устанавливаем текущего пользователя
            return of({ user: response.user, message: null });
          } else {
            console.log("REG FAIL: ", response.message);
            return of({ user: null, message: response.message }); // Если аутентификация не удалась, возвращаем null
          }
        }),

      catchError((error) => {
        console.error(error);
        return of({ user: null, message: error.message }); // Обработка ошибок
      })
    );
  }

}