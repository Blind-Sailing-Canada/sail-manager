import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {
  Inject,
  Injectable,
} from '@angular/core';
import { Comment } from '../../../../api/src/types/comment/comment';
import { BoatMaintenance } from '../../../../api/src/types/boat-maintenance/boat-maintenance';
import { Media } from '../../../../api/src/types/media/media';

@Injectable({
  providedIn: 'root'
})
export class BoatMaintenanceService {

  private readonly API_URL = '/api/boat-maintenance';

  constructor(@Inject(HttpClient) private http: HttpClient) { }

  postMaintenanceComment(id: string, comment: Comment): Observable<BoatMaintenance> {
    return this.http.post<BoatMaintenance>(`${this.API_URL}/${id}/comments`, comment);
  }

  postMaintenancePictures(boat_maintenance_id: string, pictures: Partial<Media>[]): Observable<BoatMaintenance> {
    return this.http.patch<BoatMaintenance>(`${this.API_URL}/${boat_maintenance_id}/pictures`, pictures);
  }

  deleteMaintenanceComment(boat_maintenance_id: string, comment_id: string): Observable<BoatMaintenance> {
    return this.http.delete<BoatMaintenance>(`${this.API_URL}/${boat_maintenance_id}/comments/${comment_id}`);
  }

  deleteMaintenancePicture(boat_maintenance_id: string, picture_id: string): Observable<BoatMaintenance> {
    return this.http.delete<BoatMaintenance>(`${this.API_URL}/${boat_maintenance_id}/pictures/${picture_id}`);
  }

  fetchMaintenanceRequests(query: string): Observable<BoatMaintenance[]> {
    return this.http.get<BoatMaintenance[]>(`${this.API_URL}?${query}`);
  }

  fetchOne(id: string): Observable<BoatMaintenance> {
    return this.http.get<BoatMaintenance>(`${this.API_URL}/${id}`);
  }

  updateMaintenanceRequest(id: string, maintenance: Partial<BoatMaintenance>): Observable<BoatMaintenance> {
    return this.http.patch<BoatMaintenance>(`${this.API_URL}/${id}`, maintenance);
  }

  createMaintenanceRequest(maintenance: Partial<BoatMaintenance>): Observable<BoatMaintenance> {
    return this.http.post<BoatMaintenance>(this.API_URL, maintenance);
  }

}
