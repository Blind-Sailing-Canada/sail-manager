import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {
  Inject,
  Injectable,
} from '@angular/core';
import { UserAccess } from '../../../../api/src/types/user-access/user-access';

@Injectable({
  providedIn: 'root'
})
export class UserAccessService {

  private readonly API_URL = '/api/user-access';

  constructor(@Inject(HttpClient) private http: HttpClient) { }

  public getUserAccess(profile_id: string): Observable<UserAccess> {
    return this.http.get<UserAccess>(`${this.API_URL}/${profile_id}`);
  }

}
