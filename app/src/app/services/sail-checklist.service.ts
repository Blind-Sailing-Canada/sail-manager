import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {
  Inject,
  Injectable,
} from '@angular/core';
import { SailChecklist } from '../../../../api/src/types/sail-checklist/sail-checklist';
import { Sail } from '../../../../api/src/types/sail/sail';

@Injectable({
  providedIn: 'root'
})
export class SailChecklistService {

  private readonly API_URL = '/api/checklist';

  constructor(@Inject(HttpClient) private http: HttpClient) { }

  public updateSailChecklists(sailId: string, checklists): Observable<Sail> {
    return this.http.patch<Sail>(`${this.API_URL}/sail/${sailId}/update`, checklists);
  }

  public fetchOne(id: string): Observable<SailChecklist> {
    return this.http.get<SailChecklist>(`${this.API_URL}/${id}`);
  }

  public find(query: string): Observable<SailChecklist[]> {
    return this.http.get<SailChecklist[]>(`${this.API_URL}?${query}`);
  }

  public update(id: string, checklist: Partial<SailChecklist>): Observable<SailChecklist> {
    return this.http.patch<SailChecklist>(`${this.API_URL}/${id}`, checklist);
  }

  public create(checklist: Partial<SailChecklist>): Observable<SailChecklist> {
    return this.http.post<SailChecklist>(`${this.API_URL}`, checklist);
  }

}
