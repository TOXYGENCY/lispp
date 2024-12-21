import { Injectable } from '@angular/core';
import { Chapter } from '../../domain-models/Chapter';
import { Observable, tap } from 'rxjs';
import { apiUrl, test_apiUrl } from '../../app.config';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ApiChaptersService {
  constructor(private http: HttpClient) { }
  private apiUrl = apiUrl;

  public AddChapter(title: string): Observable<any> {
    const ChapterTitle = { title } // Оборачиваем строку в объект, иначе PHP не воспримет
    return this.http.post(`${this.apiUrl}/chapters`, ChapterTitle);
  }

  public UpdateChapter(Chapter: Chapter): Observable<any> {
    const NewChapterTitle = { title: Chapter.title } // Оборачиваем строку в объект, иначе PHP не воспримет
    return this.http.put(`${this.apiUrl}/chapters/${Chapter.id}`, NewChapterTitle);
  }

  public GetAllChapters(): Observable<Chapter[]> {
    return this.http.get<Chapter[]>(`${this.apiUrl}/chapters`);
  }

  public DeleteChapter(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/chapters/${id}`);
  }
}
