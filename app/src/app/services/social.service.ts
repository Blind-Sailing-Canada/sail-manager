import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {
  Inject,
  Injectable,
} from '@angular/core';
import { Comment } from '../../../../api/src/types/comment/comment';
import { Social } from '../../../../api/src/types/social/social';
import { PaginatedSocial } from '../../../../api/src/types/social/paginated-social';

@Injectable({
  providedIn: 'root'
})
export class SocialService {

  private readonly API_URL = '/api/social';

  constructor(@Inject(HttpClient) private http: HttpClient) { }

  public sendNotification(social_id: string, notificationType: string, notificationMessage: string): Observable<void> {
    switch (notificationType) {
      case 'new':
        return this.http.post<void>(`${this.API_URL}/${social_id}/new-social-notification`, { message: notificationMessage });
      case 'update':
        return this.http.post<void>(`${this.API_URL}/${social_id}/update-social-notification`, { message: notificationMessage });
      default:
        return null;
    }
  }

  public postNewComment(social_id: string, comment: Comment): Observable<Social> {
    return this.http.post<Social>(`${this.API_URL}/${social_id}/comments`, comment);
  }

  public deleteComment(social_id: string, comment_id: string): Observable<Social> {
    return this.http.delete<Social>(`${this.API_URL}/${social_id}/comments/${comment_id}`);
  }

  public completeSocial(social_id: string): Observable<Social> {
    return this.http.patch<Social>(`${this.API_URL}/${social_id}/complete`, null);
  }

  public cancelSocial(social_id: string, social: Social): Observable<Social> {
    return this.http.patch<Social>(`${this.API_URL}/${social_id}/cancel`, social);
  }

  public fetchAvailableSocials(query?: string): Observable<Social[]> {
    if (query) {
      return this.http.get<Social[]>(`${this.API_URL}/available?${query}`);
    }

    return this.http.get<Social[]>(`${this.API_URL}/available`);
  }

  public fetchOne(social_id: string): Observable<Social> {
    return this.http.get<Social>(`${this.API_URL}/${social_id}`);
  }

  public fetchAllPaginated(
    query?: any,
    page: number = 1,
    per_page: number = 10,
    sort: string = 'entity_number,ASC'
  ): Observable<PaginatedSocial> {
    if (query) {
      return this.http
        .get<PaginatedSocial>(`${this.API_URL}?s=${JSON.stringify(query || '')}&page=${page}&per_page=${per_page}&sort=${sort}`);
    }

    return this.http.get<PaginatedSocial>(`${this.API_URL}?age=${page}&per_page=${per_page}&sort=${sort}`);
  }

  public update(social_id: string, social: Social): Observable<Social> {
    return this.http.patch<Social>(`${this.API_URL}/${social_id}`, social);
  }

  public create(social: Social): Observable<Social> {
    return this.http.post<Social>(`${this.API_URL}`, social);
  }

  public leaveSocial(social_id: string): Observable<Social> {
    return this.http.delete<Social>(`${this.API_URL}/${social_id}/leave`);
  }

  public joinSocial(social_id: string): Observable<Social> {
    return this.http.put<Social>(`${this.API_URL}/${social_id}/join`, null);
  }
}
