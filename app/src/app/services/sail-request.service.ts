import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {
  Inject,
  Injectable,
} from '@angular/core';
import { SailRequest } from '../../../../api/src/types/sail-request/sail-request';

@Injectable({
  providedIn: 'root'
})
export class SailRequestService {

  private readonly API_URL = '/api/sail-request';

  constructor(@Inject(HttpClient) private http: HttpClient) { }

  public download() {
    return this.http.get(`${this.API_URL}/download`, { responseType: 'blob' });
  }

  public fetchOne(id: string): Observable<SailRequest> {
    return this.http.get<SailRequest>(`${this.API_URL}/${id}`);
  }

  public fetchAll(query?: string): Observable<SailRequest[]> {
    if (query) {
      let completeQuery = query;

      if (query.charAt(0) !== '?') {
        completeQuery = `?${query}`;
      }

      return this.http.get<SailRequest[]>(`${this.API_URL}${completeQuery}`);
    }

    return this.http.get<SailRequest[]>(`${this.API_URL}`);
  }

  public find(query: string): Observable<SailRequest[]> {
    return this.http.get<SailRequest[]>(`${this.API_URL}/?${query}`);
  }

  public update(id: string, sailRequest: Partial<SailRequest>): Observable<SailRequest> {
    return this.http.patch<SailRequest>(`${this.API_URL}/${id}`, sailRequest);
  }

  public create(sailRequest: Partial<SailRequest>): Observable<SailRequest> {
    return this.http.post<SailRequest>(`${this.API_URL}`, sailRequest);
  }

}
