import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { apiUrl } from '../../../app.config';
import { Question } from '../../../domain-models/Question';
import { Answer } from '../../../domain-models/Answer';

@Injectable({ providedIn: 'root' })
export class ApiQuestionsService {
  constructor(private http: HttpClient) { }
  /*
  public AddQuestion(question: Question): Observable<any> {
    return this.http.post(`${apiUrl}/questions`, question);
  }

  public UpdateQuestion(question: Question): Observable<any> {
    return this.http.put(`${apiUrl}/questions/${question.id}`, question);
  }

  public GetAllQuestions(): Observable<Question[]> {
    return this.http.get<Question[]>(`${apiUrl}/questions`);
  }

  public DeleteQuestion(id: string): Observable<any> {
    return this.http.delete(`${apiUrl}/questions/${id}`);
  }

  // Привязка вопросов к ответам
  public AddQuestionAnswer(questionId: string, answerId: string, isCorrect: boolean): Observable<any> {
    return this.http.post(`${apiUrl}/questions-answers`, { questionId, answerId, isCorrect });
  } */

  public GetAnswersByQuestionId(question_id: string): Observable<Answer[]> {
    return this.http.get<Answer[]>(`${apiUrl}/questions/${question_id}/answers`);
  }
}
