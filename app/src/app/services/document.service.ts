import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {
  Inject,
  Injectable,
} from '@angular/core';
import { Document } from '../../../../api/src/types/document/document';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {

  private readonly API_URL = '/api/document';

  constructor(@Inject(HttpClient) private http: HttpClient) { }

  fetchOne(id: string): Observable<Document> {
    return this.http.get<Document>(`${this.API_URL}/${id}`);
  }

  fetchAll(): Observable<Document[]> {
    return this.http.get<Document[]>(this.API_URL);
  }

  findByName(name: string): Observable<Document[]> {
    return this.http.get<Document[]>(`${this.API_URL}?filter=name||$contL||${name}`);
  }

  update(id: string, document: Partial<Document>): Observable<Document> {
    return this.http.patch<Document>(`${this.API_URL}/${id}`, document);
  }

  create(document: Partial<Document>): Observable<Document> {
    return this.http.post<Document>(`${this.API_URL}`, document);
  }
}
