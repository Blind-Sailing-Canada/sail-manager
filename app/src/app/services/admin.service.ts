import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {
  Inject,
  Injectable,
} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private readonly API_URL = '/api/admin';

  constructor(@Inject(HttpClient) private http: HttpClient) { }

  runQuery(query: string): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/query`, { query });
  }

  downloadQuery(query: string) {
    return this.http.post(`${this.API_URL}/query/download`, { query }, { responseType: 'blob' });
  }
}
