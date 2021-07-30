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

  public updateClinic(clinicId: string, clinic: Partial<Clinic>): Observable<Clinic> {
    return this.http.patch<Clinic>(`${this.API_URL}/${clinicId}`, clinic);
  }

  public enrollInClinic(clinicId: string, profile_id: string): Observable<Clinic> {
    return this.http.patch<Clinic>(`${this.API_URL}/${clinicId}/enroll/${profile_id}`, undefined);
  }

  public leaveClinic(clinicId: string, profile_id: string): Observable<Clinic> {
    return this.http.delete<Clinic>(`${this.API_URL}/${clinicId}/leave/${profile_id}`);
  }

  public addUserToClinic(clinicId: string, profile_id: string): Observable<Clinic> {
    return this.http.patch<Clinic>(`${this.API_URL}/${clinicId}/add-user/${profile_id}`, undefined);
  }

  public graduateUserFromClinic(clinicId: string, profile_id: string): Observable<Clinic> {
    return this.http.patch<Clinic>(`${this.API_URL}/${clinicId}/graduate-user/${profile_id}`, undefined);
  }

  public removeUserToClinic(clinicId: string, profile_id: string): Observable<Clinic> {
    return this.http.delete<Clinic>(`${this.API_URL}/${clinicId}/remove-user/${profile_id}`);
  }

  public fetchClinic(clinicId: string): Observable<Clinic> {
    return this.http.get<Clinic>(`${this.API_URL}/${clinicId}`);
  }

  public fetchClinics(query?: string): Observable<Clinic[]> {
    if (query) {
      return this.http.get<Clinic[]>(`${this.API_URL}?${query}`);
    }

    return this.http.get<Clinic[]>(`${this.API_URL}`);
  }
}
