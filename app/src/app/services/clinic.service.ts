import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {
  Inject,
  Injectable,
} from '@angular/core';
import { Clinic } from '../../../../api/src/types/clinic/clinic';

@Injectable({
  providedIn: 'root'
})
export class ClinicService {

  private readonly API_URL = '/api/clinic';

  constructor(@Inject(HttpClient) private http: HttpClient) { }

  public createClinic(clinic: Partial<Clinic>): Observable<Clinic> {
    return this.http.post<Clinic>(`${this.API_URL}`, clinic);
  }

  public updateClinic(clinic_id: string, clinic: Partial<Clinic>): Observable<Clinic> {
    return this.http.patch<Clinic>(`${this.API_URL}/${clinic_id}`, clinic);
  }

  public enrollInClinic(clinic_id: string, profile_id: string): Observable<Clinic> {
    return this.http.patch<Clinic>(`${this.API_URL}/${clinic_id}/enroll/${profile_id}`, undefined);
  }

  public leaveClinic(clinic_id: string, profile_id: string): Observable<Clinic> {
    return this.http.delete<Clinic>(`${this.API_URL}/${clinic_id}/leave/${profile_id}`);
  }

  public addUserToClinic(clinic_id: string, profile_id: string): Observable<Clinic> {
    return this.http.patch<Clinic>(`${this.API_URL}/${clinic_id}/add-user/${profile_id}`, undefined);
  }

  public graduateUserFromClinic(clinic_id: string, profile_id: string): Observable<Clinic> {
    return this.http.patch<Clinic>(`${this.API_URL}/${clinic_id}/graduate-user/${profile_id}`, undefined);
  }

  public removeUserToClinic(clinic_id: string, profile_id: string): Observable<Clinic> {
    return this.http.delete<Clinic>(`${this.API_URL}/${clinic_id}/remove-user/${profile_id}`);
  }

  public fetchClinic(clinic_id: string): Observable<Clinic> {
    return this.http.get<Clinic>(`${this.API_URL}/${clinic_id}`);
  }

  public fetchClinics(query?: string): Observable<Clinic[]> {
    if (query) {
      return this.http.get<Clinic[]>(`${this.API_URL}?${query}`);
    }

    return this.http.get<Clinic[]>(`${this.API_URL}`);
  }
}
