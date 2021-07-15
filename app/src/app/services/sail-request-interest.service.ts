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
export class SailRequestInterestService {

  private readonly API_URL = '/api/sail-request-interest';

  constructor(@Inject(HttpClient) private http: HttpClient) { }

  public interested(id: string): Observable<SailRequest> {
    return this.http.post<SailRequest>(`${this.API_URL}/${id}`, null);
  }

  public uninterested(id: string): Observable<SailRequest> {
    return this.http.delete<SailRequest>(`${this.API_URL}/${id}`);
  }

}
