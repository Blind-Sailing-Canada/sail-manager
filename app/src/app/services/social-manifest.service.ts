import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {
  Inject,
  Injectable,
} from '@angular/core';
import { Profile } from '../../../../api/src/types/profile/profile';
import { SocialManifest } from '../../../../api/src/types/social-manifest/social-manifest';
import { Social } from '../../../../api/src/types/social/social';

@Injectable({
  providedIn: 'root'
})
export class SocialManifestService {

  private readonly API_URL = '/api/social-manifest';

  constructor(@Inject(HttpClient) private http: HttpClient) { }

  public getAvailableUsers(start_at: Date | string, end_at: Date | string, profileName: string): Observable<Profile[]> {
    return this.http.get<Profile[]>(`${this.API_URL}/available-users`, {
      params: {
        profileName,
        start_at: start_at.toString(),
        end_at: end_at.toString(),
      }
    });
  }

  public updateManifest(social_id: string, manifest: SocialManifest[]): Observable<Social> {
    return this.http.post<Social>(`${this.API_URL}/update-social-manifest/${social_id}`, manifest);
  }
}
