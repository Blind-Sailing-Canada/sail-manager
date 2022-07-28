import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {
  Inject,
  Injectable,
} from '@angular/core';
import { FormResponse } from '../../../../api/src/types/form-response/form-response';


@Injectable({
  providedIn: 'root'
})
export class FormResponseService {

  private readonly API_URL = '/api/form-response';

  constructor(@Inject(HttpClient) private http: HttpClient) { }

  fetchForProfile(profile_id: string): Observable<FormResponse[]> {
    return this.http.get<FormResponse[]>(`${this.API_URL}/profile/${profile_id}`);
  }

}
