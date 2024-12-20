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

  public SetCurrentUserInSession(user: User | null): void {
    if (user) {
      this.SetCurrentUser(user); // Устанавливаем текущего пользователя
    } else {
      console.error('Пользователь для записи == ' + user);
    }
  }

  // Observable, потому что это аналог Task - асинхронный контейнер метода, который можно ожидать
  public GetAllUsers(): Observable<any> {
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
    return this.http.get<User>(`${this.apiUrl}/users/email/${encodeURIComponent(email)}`).pipe(
      map(user => {
        // Если пользователь не найден, возвращаем null
        if (!user) {
          console.error('Пользователь с email ' + email + ' не найден');
          return null;
        }
        return user;
      }),
      catchError((error) => {
        // В случае ошибки (например, если пользователь не найден), возвращаем null
        console.error('Ошибка при поиске пользователя с email ' + email + ': ' + error.message);
        return of(null);
      })
    );
  }

  // Основной метод регистрации - вызывается из публичного AuthenticateAndToSession
  private _Authenticate(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/auth`, credentials).pipe(
      tap(response => console.log('_Authenticate got:', response)),

      map(
        (response: any) => { // Сюда приходит ответ из PHP
          if (response.success) {
            return response; // В AuthenticateAndToSession возвращаем результат, если регистрация успешна
          } else {
            return { success: false, message: response.message }; // В AuthenticateAndToSession возвращаем результат, если вход не удался
          }
        }),
      catchError((error: any) => {
        console.error(error);
        return of({ success: false, message: "Ошибка сервиса при входе. Попробуйте позже." }); // В AuthenticateAndToSession возвращаем объект с ошибкой из PHP и false
      })
    );
  }


  public AuthenticateAndToSession(credentials: any): Observable<any> {
    return this._Authenticate(credentials).pipe(
      tap(response => console.log('AuthenticateAndToSession got:', response)),
      map(response => {
        this.SetCurrentUserInSession(response.user);
        return response;
      }),
      catchError((error) => {
        console.error(error);
        return of({ success: false, message: "Ошибка при входе в сервис. Попробуйте позже." });
      })
    );
  }

  // Основной метод регистрации - вызывается из публичного RegisterAndToSession
  private _Register(User: User): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/register`, User).pipe(
      tap(response => console.log('_Register got:', response)),

      map(
        (response: any) => { // Сюда приходит ответ из PHP
          if (response.success) {
            return { user: response.user, message: null }; // В RegisterAndToSession возвращаем пользователя, если регистрация успешна
          } else {
            throw new Error(response.message); // Генерируем ошибку в RegisterAndToSession в catchError, если регистрация не удалась
          }
        }),

      catchError((error: any) => {
        console.error(error);
        return of({ user: null, message: error.message }); // В RegisterAndToSession возвращаем объект с ошибкой из PHP и null
      })
    );
  }

  public RegisterAndToSession(User: User): Observable<any> {
    return this._Register(User).pipe(
      tap(response => console.log('RegisterAndToSession got:', response)),

      map(
        (response: any) => { // Сюда приходит ответ из _Register
          this.SetCurrentUserInSession(response.user);
          return response;
        }),

      catchError((error) => {
        console.error(error);
        this.SetCurrentUserInSession(null);
        return of({ success: false, message: "Ошибка при входе в сервис. Попробуйте позже." }); // Передача ошибок
      })
    );
  }

}