import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {
  Inject,
  Injectable,
} from '@angular/core';
import { PaginatedMedia } from '../../../../api/src/types/media/paginated-media';
import { Media } from '../../../../api/src/types/media/media';

@Injectable({
  providedIn: 'root'
})
export class MediaService {
  private readonly API_URL = '/api/media/';

  constructor(@Inject(HttpClient) private http: HttpClient) { }

  public fetchAllPaginated(
    query?: any,
    page: number = 1,
    per_page: number = 10,
    sort: string = 'created_at,DESC',
    joins: string[] = [],
  ): Observable<PaginatedMedia> {

    return this.http
      .get<PaginatedMedia>(
        `${this.API_URL}?s=${JSON.stringify(query || {})}&page=${page}&per_page=${per_page}&sort=${sort}&join=${joins.join('&join=')}`);
  }

  public fetchOne(media_id: string): Observable<Media> {
    return this.http.get<Media>(`${this.API_URL}/${media_id}`);
  }

  public updateOne(media_id: string, media: Partial<Media>): Observable<Media> {
    return this.http.patch<Media>(`${this.API_URL}/${media_id}`, media);
  }

  public delete(media_id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}${media_id}`);
  }

}
