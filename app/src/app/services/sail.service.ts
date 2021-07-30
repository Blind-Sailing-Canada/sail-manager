import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {
  Inject,
  Injectable,
} from '@angular/core';
import { Comment } from '../../../../api/src/types/comment/comment';
import { Sail } from '../../../../api/src/types/sail/sail';
import { Boat } from '../../../../api/src/types/boat/boat';

@Injectable({
  providedIn: 'root'
})
export class SailService {

  private readonly API_URL = '/api/sail';

  constructor(@Inject(HttpClient) private http: HttpClient) { }

  public sendNotification(sail_id: string, notificationType: string, notificationMessage: string): Observable<void> {
    switch (notificationType) {
      case 'new':
        return this.http.post<void>(`${this.API_URL}/${sail_id}/new-sail-notification`, { message: notificationMessage });
      case 'update':
        return this.http.post<void>(`${this.API_URL}/${sail_id}/update-sail-notification`, { message: notificationMessage });
      default:
        return null;
    }
  }

  public postNewComment(sail_id: string, comment: Comment): Observable<Sail> {
    return this.http.post<Sail>(`${this.API_URL}/${sail_id}/comments`, comment);
  }

  public deleteComment(sail_id: string, commentId: string): Observable<Sail> {
    return this.http.delete<Sail>(`${this.API_URL}/${sail_id}/comments/${commentId}`);
  }

  public startSail(id: string): Observable<Sail> {
    return this.http.patch<Sail>(`${this.API_URL}/${id}/start/`, null);
  }

  public completeSail(id: string): Observable<Sail> {
    return this.http.patch<Sail>(`${this.API_URL}/${id}/complete`, null);
  }

  public cancelSail(id: string, sail: Sail): Observable<Sail> {
    return this.http.patch<Sail>(`${this.API_URL}/${id}/cancel`, sail);
  }

  public fetchAvailableBoats(start_date: string | Date, end_date: string | Date): Observable<Boat[]> {
    return this.http.get<Boat[]>(`${this.API_URL}/available-boats?start=${start_date}&end=${end_date}`);
  }

  public fetchTodaySailsForAll(query?: string): Observable<Sail[]> {
    if (query) {
      return this.http.get<Sail[]>(`${this.API_URL}/user/today?${query}`);
    }

    return this.http.get<Sail[]>(`${this.API_URL}/user/today`);
  }

  public fetchTodaySailsForUser(profile_id: string, query?: string): Observable<Sail[]> {
    if (query) {
      return this.http.get<Sail[]>(`${this.API_URL}/user/today?${query}&profile_id=${profile_id}`);
    }

    return this.http.get<Sail[]>(`${this.API_URL}/user/today?profile_id=${profile_id}`);
  }

  public fetchPastSailsForAll(query?: string): Observable<Sail[]> {
    if (query) {
      return this.http.get<Sail[]>(`${this.API_URL}/user/past?${query}`);
    }

    return this.http.get<Sail[]>(`${this.API_URL}/user/past`);
  }

  public fetchPastSailsForUser(profile_id: string, query?: string): Observable<Sail[]> {
    if (query) {
      return this.http.get<Sail[]>(`${this.API_URL}/user/past?${query}&profile_id=${profile_id}`);
    }

    return this.http.get<Sail[]>(`${this.API_URL}/user/past?profile_id=${profile_id}`);
  }

  public fetchAvailableSails(query?: string): Observable<Sail[]> {
    if (query) {
      return this.http.get<Sail[]>(`${this.API_URL}/available?${query}`);
    }

    return this.http.get<Sail[]>(`${this.API_URL}/available`);
  }

  public fetchInProgressSailsForAll(query?: string): Observable<Sail[]> {
    if (query) {
      return this.http.get<Sail[]>(`${this.API_URL}/user/in-progress?${query}`);
    }

    return this.http.get<Sail[]>(`${this.API_URL}/user/in-progress`);
  }

  public fetchInProgressSailsForUser(profile_id: string, query?: string): Observable<Sail[]> {
    if (query) {
      return this.http.get<Sail[]>(`${this.API_URL}/user/in-progress?${query}&profile_id=${profile_id}`);
    }

    return this.http.get<Sail[]>(`${this.API_URL}/user/in-progress?profile_id=${profile_id}`);
  }

  public fetchFutureSailsForUser(profile_id: string, query?: string): Observable<Sail[]> {
    if (query) {
      return this.http.get<Sail[]>(`${this.API_URL}/user/future?${query}&profile_id=${profile_id}`);
    }

    return this.http.get<Sail[]>(`${this.API_URL}/user/future?profile_id=${profile_id}`);
  }

  public fetchOne(id: string): Observable<Sail> {
    return this.http.get<Sail>(`${this.API_URL}/${id}`);
  }

  public count(query?: string): Observable<number> {
    if (query) {
      return this.http.get<number>(`${this.API_URL}/count?${query}`);
    }

    return this.http.get<number>(`${this.API_URL}/count`);
  }

  public countUserSail(profile_id: string, query?: string): Observable<number> {
    if (query) {
      return this.http.get<number>(`${this.API_URL}/user/${profile_id}/count?${query}`);
    }

    return this.http.get<number>(`${this.API_URL}/user/${profile_id}/count`);
  }

  public fetchUserSail(profile_id: string, query?: string): Observable<Sail[]> {
    if (query) {
      return this.http.get<Sail[]>(`${this.API_URL}/user/all?${query}&profile_id=${profile_id}`);
    }

    return this.http.get<Sail[]>(`${this.API_URL}/user/all?profile_id=${profile_id}`);
  }

  public fetchAll(query?: string): Observable<Sail[]> {
    if (query) {
      return this.http.get<Sail[]>(`${this.API_URL}${query}`);
    }

    return this.http.get<Sail[]>(`${this.API_URL}`);
  }

  public findByName(name: string): Observable<Sail[]> {
    return this.http.get<Sail[]>(`${this.API_URL}/?substring=${name}&fields=name`);
  }

  public search(query: any): Observable<Sail[]> {
    return this.http.get<Sail[]>(`${this.API_URL}`, { params: query });
  }

  public download(query: any) {
    return this.http.get(`${this.API_URL}/download`, { params: query, responseType: 'blob' });
  }

  public update(id: string, sail: Sail): Observable<Sail> {
    return this.http.patch<Sail>(`${this.API_URL}/${id}`, sail);
  }

  public create(sail: Sail): Observable<Sail> {
    return this.http.post<Sail>(`${this.API_URL}`, sail);
  }

  public createFromSailRequest(sail: Sail, sailRequestId: string): Observable<Sail> {
    return this.http.post<Sail>(`${this.API_URL}/sail-request`, { sail, sailRequestId });
  }

  public joinAsCrew(sail_id: string): Observable<Sail> {
    return this.joinSail('crew', sail_id);
  }

  public joinAsPassenger(sail_id: string): Observable<Sail> {
    return this.joinSail('sailor', sail_id);
  }

  public joinAsSkipper(sail_id: string): Observable<Sail> {
    return this.joinSail('skipper', sail_id);
  }

  public leaveSail(sail_id: string): Observable<Sail> {
    return this.http.delete<Sail>(`${this.API_URL}/${sail_id}/leave`);
  }

  private joinSail(as: string, sail_id: string): Observable<Sail> {
    return this.http.put<Sail>(`${this.API_URL}/${sail_id}/join/${as}`, null);
  }
}
