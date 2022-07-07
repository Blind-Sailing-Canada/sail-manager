import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {
  Inject,
  Injectable,
} from '@angular/core';
import { Media } from '../../../../api/src/types/media/media';

@Injectable({
  providedIn: 'root'
})
export class SocialPicturesService {

  constructor(@Inject(HttpClient) private http: HttpClient) { }

  public getPictures(social_id: string): Observable<Media[]> {
    return this.http.get<Media[]>(this.API_URL(social_id));
  }

  public addNewPictures(social_id: string, pictures: Media[]): Observable<Media[]> {
    return this.http.put<Media[]>(this.API_URL(social_id), pictures);
  }

  public deletePicture(social_id: string, picture_id: string): Observable<Media[]> {
    return this.http.delete<Media[]>(`${this.API_URL(social_id)}/${picture_id}`);
  }

  private readonly API_URL = (social_id: string) => `/api/social/${social_id}/pictures`;

}
