import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {
  Inject,
  Injectable,
} from '@angular/core';
import { Comment } from '../../../../api/src/types/comment/comment';
import { Sail } from '../../../../api/src/types/sail/sail';
import { Boat } from '../../../../api/src/types/boat/boat';
import { PaginatedSail } from '../../../../api/src/types/sail/paginated-sail';

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

  public deleteComment(sail_id: string, comment_id: string): Observable<Sail> {
    return this.http.delete<Sail>(`${this.API_URL}/${sail_id}/comments/${comment_id}`);
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

  public fetchAvailableSails(query?: string): Observable<Sail[]> {
    if (query) {
      return this.http.get<Sail[]>(`${this.API_URL}/available?${query}`);
    }

    return this.http.get<Sail[]>(`${this.API_URL}/available`);
  }

  public fetchOneByNumber(sail_number: number): Observable<Sail> {
    return this.http.get<Sail>(`${this.API_URL}/number/${sail_number}`);
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

  public searchPaginated(query: any): Observable<PaginatedSail> {
    return this.http.get<PaginatedSail>(`${this.API_URL}`, { params: query });
  }

  public update(id: string, sail: Sail): Observable<Sail> {
    return this.http.patch<Sail>(`${this.API_URL}/${id}`, sail);
  }

  public create(sail: Sail): Observable<Sail> {
    return this.http.post<Sail>(`${this.API_URL}`, sail);
  }

  public createFromSailRequest(sail: Sail, sail_request_id: string): Observable<Sail> {
    return this.http.post<Sail>(`${this.API_URL}/sail-request`, { sail, sail_request_id });
  }

  public joinAsCrew(sail_id: string): Observable<Sail> {
    return this.joinSail('crew', sail_id);
  }

  public joinAsSailor(sail_id: string): Observable<Sail> {
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
