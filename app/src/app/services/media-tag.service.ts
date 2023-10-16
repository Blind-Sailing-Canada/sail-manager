import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {
  Inject,
  Injectable,
} from '@angular/core';
import { MediaTag } from '../../../../api/src/types/media-tag/media-tag';

@Injectable({
  providedIn: 'root'
})
export class MediaTagService {
  private readonly API_URL = '/api/media-tag/';

  constructor(@Inject(HttpClient) private http: HttpClient) { }

  public createOne(media_tag: Partial<MediaTag>): Observable<MediaTag> {
    return this.http.post<MediaTag>(`${this.API_URL}`, media_tag);
  }

  public delete(media_tag_id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}${media_tag_id}`);
  }

}
