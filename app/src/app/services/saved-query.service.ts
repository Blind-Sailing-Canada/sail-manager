import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {
  Inject,
  Injectable,
} from '@angular/core';
import { PaginatedSavedQuery } from '../../../../api/src/types/saved-query/paginated-saved-query';
import { SavedQuery } from '../../../../api/src/types/saved-query/saved-query';


@Injectable({
  providedIn: 'root'
})
export class SaveQueryService {

  private readonly API_URL = '/api/saved-query';

  constructor(@Inject(HttpClient) private http: HttpClient) { }

  fetchSavedQuery(id: string): Observable<SavedQuery> {
    return this.http.get<SavedQuery>(`${this.API_URL}/${id}`);
  }

  createSavedQuery(savedQuery: Partial<SavedQuery>): Observable<SavedQuery> {
    return this.http.post<SavedQuery>(`${this.API_URL}`, savedQuery);
  }

  updateSavedQuery(id: string, savedQuery: Partial<SavedQuery>): Observable<SavedQuery> {
    return this.http.patch<SavedQuery>(`${this.API_URL}/${id}`, savedQuery);
  }

  deleteSavedQuery(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }

  runQuery(query: string): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/query`, { query });
  }

  downloadQuery(query: string) {
    return this.http.post(`${this.API_URL}/query/download`, { query }, { responseType: 'blob' });
  }

  public fetchAllPaginated(
    query?: any,
    page: number = 1,
    per_page: number = 10,
    sort: string = 'entity_number,ASC'
  ): Observable<PaginatedSavedQuery> {
    return this.http
      .get<PaginatedSavedQuery>(`${this.API_URL}?s=${JSON.stringify(query || {})}&page=${page}&per_page=${per_page}&sort=${sort}`);
  }
}
