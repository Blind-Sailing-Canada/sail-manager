import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {
  Inject,
  Injectable,
} from '@angular/core';
import { Setting } from '../../../../api/src/types/settings/setting';
import { Settings } from '../../../../api/src/types/settings/settings';

@Injectable({
  providedIn: 'root'
})
export class SettingService {

  private readonly API_URL = '/api/setting';

  constructor(@Inject(HttpClient) private http: HttpClient) { }

  public updateSettingForProfile(profile_id: string, settings: Setting): Observable<Settings> {
    return this.http.post<Settings>(`${this.API_URL}/for-user/${profile_id}`, settings);
  }

  public fetchSettingsForProfile(profile_id: string): Observable<Settings> {
    return this.http.get<Settings>(`${this.API_URL}/for-user/${profile_id}`);
  }
}
