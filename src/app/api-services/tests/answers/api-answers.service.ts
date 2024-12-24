import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { apiUrl } from '../../../app.config';
import { Answer } from '../../../domain-models/Answer';
import { ButtonModule } from 'primeng/button';

@Injectable({ providedIn: 'root' })
export class ApiAnswersService {
  constructor(private http: HttpClient) { }

  public GetIsCorrectByAnswerId(answer_id: string): Observable<boolean> {
    return this.http.get<boolean>(`${apiUrl}/answers/${answer_id}/iscorrect`);
  }
}
