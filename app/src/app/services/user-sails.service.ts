import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {
  Inject,
  Injectable,
} from '@angular/core';
import { Sail } from '../../../../api/src/types/sail/sail';
import { PaginatedSail } from '../../../../api/src/types/sail/paginated-sail';

@Injectable({
  providedIn: 'root'
})
export class UserSailsService {

  private readonly API_URL = '/api/user_sails';

  constructor(@Inject(HttpClient) private http: HttpClient) { }

  public fetchTodaySailsForAll(query?: string): Observable<Sail[]> {
    if (query) {
      return this.http.get<Sail[]>(`${this.API_URL}/today?${query}`);
    }

    return this.http.get<Sail[]>(`${this.API_URL}/today`);
  }

  public fetchTodaySailsForUser(profile_id: string, query?: string): Observable<Sail[]> {
    if (query) {
      return this.http.get<Sail[]>(`${this.API_URL}/today?${query}&profile_id=${profile_id}`);
    }

    return this.http.get<Sail[]>(`${this.API_URL}/today?profile_id=${profile_id}`);
  }

  public fetchPastSailsForAll(query?: string): Observable<Sail[]> {
    if (query) {
      return this.http.get<Sail[]>(`${this.API_URL}/past?${query}`);
    }

    return this.http.get<Sail[]>(`${this.API_URL}/past`);
  }

  public fetchPastSailsForUser(profile_id: string, query?: string): Observable<Sail[]> {
    if (query) {
      return this.http.get<Sail[]>(`${this.API_URL}/past?${query}&profile_id=${profile_id}`);
    }

    return this.http.get<Sail[]>(`${this.API_URL}/past?profile_id=${profile_id}`);
  }

  public fetchInProgressSailsForAll(query?: string): Observable<Sail[]> {
    if (query) {
      return this.http.get<Sail[]>(`${this.API_URL}/in-progress?${query}`);
    }

    return this.http.get<Sail[]>(`${this.API_URL}/in-progress`);
  }

  public fetchInProgressSailsForUser(profile_id: string, query?: string): Observable<Sail[]> {
    if (query) {
      return this.http.get<Sail[]>(`${this.API_URL}/in-progress?${query}&profile_id=${profile_id}`);
    }

    return this.http.get<Sail[]>(`${this.API_URL}/in-progress?profile_id=${profile_id}`);
  }

  public fetchFutureSailsForUser(profile_id: string, query?: string): Observable<Sail[]> {
    if (query) {
      return this.http.get<Sail[]>(`${this.API_URL}/future?${query}&profile_id=${profile_id}`);
    }

    return this.http.get<Sail[]>(`${this.API_URL}/future?profile_id=${profile_id}`);
  }

  public countUserSail(profile_id: string, query?: string): Observable<number> {
    if (query) {
      return this.http.get<number>(`${this.API_URL}/${profile_id}/count?${query}`);
    }

    return this.http.get<number>(`${this.API_URL}/${profile_id}/count`);
  }

  public fetchUserSailsPaginated(
    query?: any,
    page: number = 1,
    per_page: number = 10,
    sort: string = 'name,ASC',
  ): Observable<PaginatedSail> {

    return this.http
      .get<PaginatedSail>(`${this.API_URL}/?s=${JSON.stringify(query || {})}&page=${page}&per_page=${per_page}&sort=${sort}`);

  }

}
