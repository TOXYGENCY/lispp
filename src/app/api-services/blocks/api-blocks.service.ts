import { Injectable } from '@angular/core';
import { Block } from '../../domain-models/Block';
import { Observable, tap } from 'rxjs';
import { apiUrl, test_apiUrl } from '../../app.config';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ApiBlocksService {
  constructor(private http: HttpClient) { }
  private apiUrl = apiUrl;

  public AddBlock(Block: Block, chapter_id: string): Observable<any> {
    const BlockData = { Block: Block, chapter_id: chapter_id }
    return this.http.post(`${this.apiUrl}/blocks`, BlockData);
  }

  public UpdateBlock(NewBlock: Block, chapter_id: string): Observable<any> {
    const NewBlockData = { Block: NewBlock, chapter_id: chapter_id }
    return this.http.put(`${this.apiUrl}/blocks/${NewBlock.id}`, NewBlockData);
  }

  public GetLinkedChapter(block_id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/blocks/${block_id}/chapter`).pipe(tap(response => console.log(response)));
  }

  public GetAllBlocks(): Observable<Block[]> {
    return this.http.get<Block[]>(`${this.apiUrl}/blocks`);
  }

  public DeleteBlock(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/blocks/${id}`);
  }
}
