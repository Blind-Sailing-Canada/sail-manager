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

  public sendNotification(sailId: string, notificationType: string, notificationMessage: string): Observable<void> {
    switch (notificationType) {
      case 'new':
        return this.http.post<void>(`${this.API_URL}/${sailId}/new-sail-notification`, { message: notificationMessage });
      case 'update':
        return this.http.post<void>(`${this.API_URL}/${sailId}/update-sail-notification`, { message: notificationMessage });
      default:
        return null;
    }
  }

  public postNewComment(sailId: string, comment: Comment): Observable<Sail> {
    return this.http.post<Sail>(`${this.API_URL}/${sailId}/comments`, comment);
  }

  public deleteComment(sailId: string, commentId: string): Observable<Sail> {
    return this.http.delete<Sail>(`${this.API_URL}/${sailId}/comments/${commentId}`);
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

  public fetchAvailableBoats(startDate: string | Date, endDate: string | Date): Observable<Boat[]> {
    return this.http.get<Boat[]>(`${this.API_URL}/available-boats?start=${startDate}&end=${endDate}`);
  }

  public fetchTodaySailsForAll(query?: string): Observable<Sail[]> {
    if (query) {
      return this.http.get<Sail[]>(`${this.API_URL}/user/today?${query}`);
    }

    return this.http.get<Sail[]>(`${this.API_URL}/user/today`);
  }

  public fetchTodaySailsForUser(profileId: string, query?: string): Observable<Sail[]> {
    if (query) {
      return this.http.get<Sail[]>(`${this.API_URL}/user/today?${query}&profileId=${profileId}`);
    }

    return this.http.get<Sail[]>(`${this.API_URL}/user/today?profileId=${profileId}`);
  }

  public fetchPastSailsForAll(query?: string): Observable<Sail[]> {
    if (query) {
      return this.http.get<Sail[]>(`${this.API_URL}/user/past?${query}`);
    }

    return this.http.get<Sail[]>(`${this.API_URL}/user/past`);
  }

  public fetchPastSailsForUser(profileId: string, query?: string): Observable<Sail[]> {
    if (query) {
      return this.http.get<Sail[]>(`${this.API_URL}/user/past?${query}&profileId=${profileId}`);
    }

    return this.http.get<Sail[]>(`${this.API_URL}/user/past?profileId=${profileId}`);
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

  public fetchInProgressSailsForUser(profileId: string, query?: string): Observable<Sail[]> {
    if (query) {
      return this.http.get<Sail[]>(`${this.API_URL}/user/in-progress?${query}&profileId=${profileId}`);
    }

    return this.http.get<Sail[]>(`${this.API_URL}/user/in-progress?profileId=${profileId}`);
  }

  public fetchFutureSailsForUser(profileId: string, query?: string): Observable<Sail[]> {
    if (query) {
      return this.http.get<Sail[]>(`${this.API_URL}/user/future?${query}&profileId=${profileId}`);
    }

    return this.http.get<Sail[]>(`${this.API_URL}/user/future?profileId=${profileId}`);
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

  public countUserSail(profileId: string, query?: string): Observable<number> {
    if (query) {
      return this.http.get<number>(`${this.API_URL}/user/${profileId}/count?${query}`);
    }

    return this.http.get<number>(`${this.API_URL}/user/${profileId}/count`);
  }

  public fetchUserSail(profileId: string, query?: string): Observable<Sail[]> {
    if (query) {
      return this.http.get<Sail[]>(`${this.API_URL}/user/all?${query}&profileId=${profileId}`);
    }

    return this.http.get<Sail[]>(`${this.API_URL}/user/all?profileId=${profileId}`);
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

  public joinAsCrew(sailId: string): Observable<Sail> {
    return this.joinSail('crew', sailId);
  }

  public joinAsPassenger(sailId: string): Observable<Sail> {
    return this.joinSail('sailor', sailId);
  }

  public joinAsSkipper(sailId: string): Observable<Sail> {
    return this.joinSail('skipper', sailId);
  }

  public leaveSail(sailId: string): Observable<Sail> {
    return this.http.delete<Sail>(`${this.API_URL}/${sailId}/leave`);
  }

  private joinSail(as: string, sailId: string): Observable<Sail> {
    return this.http.put<Sail>(`${this.API_URL}/${sailId}/join/${as}`, null);
  }
}
