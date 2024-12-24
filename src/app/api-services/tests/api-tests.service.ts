import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { apiUrl } from '../../app.config';
import { Test } from '../../domain-models/Test';
import { Block } from '../../domain-models/Block';
import { Question } from '../../domain-models/Question';

@Injectable({ providedIn: 'root' })
export class ApiTestsService {
  constructor(private http: HttpClient) { }
  apiUrl: string = apiUrl;

  // Добавление теста с вопросами и блоками
  public AddTest(testData: Test): Observable<any> {
    return this.http.post(`${this.apiUrl}/tests`, testData);
  }

  // Получение всех тестов
  public GetAllTests(): Observable<Test[]> {
    return this.http.get<Test[]>(`${this.apiUrl}/tests`);
  }

  // Получение связанных вопросов
  public GetQuestionsByTestId(test_id: string): Observable<Question[]> {
    return this.http.get<Question[]>(`${this.apiUrl}/tests/${test_id}/questions`);
  }

  // Отправка ответов
  public SubmitTestAnswers(test_id: string, answers: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/tests/${test_id}/submit`, answers);
  }

  // Обновить тест
  public UpdateTest(test_id: string, testData: Test): Observable<any> {
    return this.http.put(`${this.apiUrl}/tests/${test_id}`, testData);
  }

  // Удаление теста
  public DeleteTestById(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/tests/${id}`);
  }

  public GetBlockByTestId(test_id: string): Observable<Block> {
    return this.http.get<Block>(`${this.apiUrl}/tests/${test_id}/blocks`);
  }
}
