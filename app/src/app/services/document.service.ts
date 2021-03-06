import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {
  Inject,
  Injectable,
} from '@angular/core';
import { Document } from '../../../../api/src/types/document/document';
import { EntityType } from '../models/entity-type';
import { PaginatedDocument } from '../../../../api/src/types/document/paginated-document';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {

  private readonly API_URL = '/api/document';

  constructor(@Inject(HttpClient) private http: HttpClient) { }

  fetchOne(id: string): Observable<Document> {
    return this.http.get<Document>(`${this.API_URL}/${id}`);
  }

  fetchAll(documentable_type?: EntityType, documentable_id?: string): Observable<Document[]> {
    const query = {
      documentable_id,
      documentable_type
    };

    if (documentable_type && documentable_id) {
      return this.http.get<Document[]>(`${this.API_URL}?s=${JSON.stringify(query)}`);
    }

    return this.http.get<Document[]>(this.API_URL);
  }

  public fetchAllPaginated(
    query?: any,
    page: number = 1,
    per_page: number = 10,
    sort: string = 'created_at,DESC'
  ): Observable<PaginatedDocument> {
    return this.http
      .get<PaginatedDocument>(`${this.API_URL}?s=${JSON.stringify(query || {})}&page=${page}&per_page=${per_page}&sort=${sort}`);
  }

  findByName(name: string): Observable<Document[]> {
    return this.http.get<Document[]>(`${this.API_URL}?filter=name||$contL||${name}`);
  }

  update(document_id: string, document: Partial<Document>): Observable<Document> {
    return this.http.patch<Document>(`${this.API_URL}/${document_id}`, document);
  }

  create(document: Partial<Document>): Observable<Document> {
    return this.http.post<Document>(`${this.API_URL}`, document);
  }

  delete(document_id: string): Observable<any>  {
    return this.http.delete<any>(`${this.API_URL}/${document_id}`);
  }
}
