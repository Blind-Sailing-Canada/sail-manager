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

  public getAvailableSailors(start_at: Date | string, end_at: Date | string, sailorName: string): Observable<Profile[]> {
    return this.http.get<Profile[]>(`${this.API_URL}/available-sailors`, {
      params: {
        sailorName,
        start_at: start_at.toString(),
        end_at: end_at.toString(),
      }
    });
  }

  public updateManifest(sail_id: string, manifest: SailManifest[]): Observable<Sail> {
    return this.http.post<Sail>(`${this.API_URL}/update-sail-manifest/${sail_id}`, manifest);
  }
}
