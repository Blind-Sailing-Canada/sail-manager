import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {
  Inject,
  Injectable,
} from '@angular/core';
import { Media } from '../../../../api/src/types/media/media';

export interface PaginatedMedia {
  count: number;
  data: Media[];
  page: number;
  pageCount: number;
  total: number;
}

@Injectable({
  providedIn: 'root'
})
export class MediaService {
  private readonly API_URL = '/api/media/';

  constructor(@Inject(HttpClient) private http: HttpClient) { }

  public getPaginatedMedia(query?: any, page: number = 0, per_page: number = 20): Observable<PaginatedMedia> {
    return this.http.get<PaginatedMedia>(`${this.API_URL}?s=${JSON.stringify(query || '')}&page=${page}&per_page=${per_page}`);
  }

  public delete(media_id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}${media_id}`);
  }

}
