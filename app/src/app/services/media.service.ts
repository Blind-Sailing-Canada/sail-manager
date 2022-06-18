import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {
  Inject,
  Injectable,
} from '@angular/core';
import { Media } from '../../../../api/src/types/media/media';
import { MediaQuery } from '../../../../api/src/types/media/media-query';

@Injectable({
  providedIn: 'root'
})
export class MediaService {
  private readonly API_URL = '/api/media/';

  constructor(@Inject(HttpClient) private http: HttpClient) { }

  public get(query?: MediaQuery): Observable<Media[]> {
    return this.http.get<Media[]>(`${this.API_URL}?q=${JSON.stringify(query || '')}`);
  }

  public delete(media_id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}${media_id}`);
  }

}
