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
export class SailPicturesService {

  private readonly API_URL = (sailId: string) => `/api/sail/${sailId}/pictures`;

  constructor(@Inject(HttpClient) private http: HttpClient) { }

  public getPictures(sailId: string): Observable<Media[]> {
    return this.http.get<Media[]>(this.API_URL(sailId));
  }

  public addNewPictures(sailId: string, pictures: Media[]): Observable<Media[]> {
    return this.http.put<Media[]>(this.API_URL(sailId), pictures);
  }

  public deletePicture(sailId: string, pictureId: string): Observable<Media[]> {
    return this.http.delete<Media[]>(`${this.API_URL(sailId)}/${pictureId}`);
  }

}
