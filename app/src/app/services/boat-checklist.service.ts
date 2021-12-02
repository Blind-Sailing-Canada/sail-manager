import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {
  Inject,
  Injectable,
} from '@angular/core';
import { BoatChecklist } from '../../../../api/src/types/boat-checklist/boat-checklist';

@Injectable({
  providedIn: 'root'
})
export class BoatChecklistService {

  private readonly API_URL = '/api/boat-checklist';

  constructor(@Inject(HttpClient) private http: HttpClient) { }

  fetchOne(id: string): Observable<BoatChecklist> {
    return this.http.get<BoatChecklist>(`${this.API_URL}/${id}`);
  }

  fetchAll(): Observable<BoatChecklist[]> {
    return this.http.get<BoatChecklist[]>(this.API_URL);
  }

  update(id: string, checklist: Partial<BoatChecklist>): Observable<BoatChecklist> {
    return this.http.patch<BoatChecklist>(`${this.API_URL}/${id}`, checklist);
  }

  create(checklist: Partial<BoatChecklist>): Observable<BoatChecklist> {
    return this.http.post<BoatChecklist>(`${this.API_URL}`, checklist);
  }
}
