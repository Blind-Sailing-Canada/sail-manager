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

  constructor(@Inject(HttpClient) private http: HttpClient) { }

  public getPictures(sail_id: string): Observable<Media[]> {
    return this.http.get<Media[]>(this.API_URL(sail_id));
  }

  public addNewPictures(sail_id: string, pictures: Media[]): Observable<Media[]> {
    return this.http.put<Media[]>(this.API_URL(sail_id), pictures);
  }

  public deletePicture(sail_id: string, pictureId: string): Observable<Media[]> {
    return this.http.delete<Media[]>(`${this.API_URL(sail_id)}/${pictureId}`);
  }

  private readonly API_URL = (sail_id: string) => `/api/sail/${sail_id}/pictures`;

}
