import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {
  Inject,
  Injectable,
} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SailStatsService {

  private readonly API_URL = '/api/sail-stats';

  constructor(@Inject(HttpClient) private http: HttpClient) { }

  public get_user_sails(year: number): Observable<any> {
    return this.http.get(`${this.API_URL}/user-sails/${year}`);
  }

  public get_cancelled_sails(year: number): Observable<any> {
    return this.http.get(`${this.API_URL}/cancelled-sails/${year}`);
  }

  public get_boat_sails(year: number): Observable<any> {
    return this.http.get(`${this.API_URL}/boat-sails/${year}`);
  }
}
