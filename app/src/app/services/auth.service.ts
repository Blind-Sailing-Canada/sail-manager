import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {
  Inject,
  Injectable,
} from '@angular/core';
import { Profile } from '../../../../api/src/types/profile/profile';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly API_URL = '/api/auth';

  constructor(@Inject(HttpClient) private http: HttpClient) { }

  login(token): Observable<Profile> {
    return this.http.get<Profile>(`${this.API_URL}/login`, {
      headers: { authorization: `Bearer ${token}` }
    });
  }

  logout(): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/logout`);
  }
}
