import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {
  Inject,
  Injectable,
} from '@angular/core';
import { Profile } from '../../../../api/src/types/profile/profile';
import { SailManifest } from '../../../../api/src/types/sail-manifest/sail-manifest';
import { Sail } from '../../../../api/src/types/sail/sail';

@Injectable({
  providedIn: 'root'
})
export class SailManifestService {

  private readonly API_URL = '/api/sail-manifest';

  constructor(@Inject(HttpClient) private http: HttpClient) { }

  public getAvailableSailors(start: Date | string, end: Date | string, sailorName: string): Observable<Profile[]> {
    return this.http.get<Profile[]>(`${this.API_URL}/available-sailors`, {
      params: {
        sailorName,
        start: start.toString(),
        end: end.toString(),
      }
    });
  }

  public updateManifest(sailId: string, manifest: SailManifest[]): Observable<Sail> {
    return this.http.post<Sail>(`${this.API_URL}/update-sail-manifest/${sailId}`, manifest);
  }
}
