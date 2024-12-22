import { Injectable } from '@angular/core';
import { Paragraph } from '../../domain-models/Paragraph';
import { Observable, tap } from 'rxjs';
import { apiUrl, test_apiUrl } from '../../app.config';
import { HttpClient } from '@angular/common/http';
import { Block } from '../../domain-models/Block';

@Injectable({ providedIn: 'root' })
export class ApiParagraphsService {
  constructor(private http: HttpClient) { }
  private apiUrl = apiUrl;

  public AddParagraph(Paragraph: Paragraph, block_id: string): Observable<any> {
    const ParagraphData = { Paragraph: Paragraph, block_id: block_id }
    return this.http.post(`${this.apiUrl}/paragraphs`, ParagraphData);
  }

  public UpdateParagraph(NewParagraph: Paragraph, block_id: string): Observable<any> {
    const NewParagraphData = { Paragraph: NewParagraph, block_id: block_id }
    return this.http.put(`${this.apiUrl}/paragraphs/${NewParagraph.id}`, NewParagraphData);
  }

  public GetLinkedBlock(paragraph_id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/paragraphs/${paragraph_id}/block`);
  }

  public GetAllParagraphs(): Observable<Paragraph[]> {
    return this.http.get<Paragraph[]>(`${this.apiUrl}/paragraphs`);
  }

  public DeleteParagraph(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/paragraphs/${id}`);
  }
}
