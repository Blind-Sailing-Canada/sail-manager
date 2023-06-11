import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {
  Inject,
  Injectable,
} from '@angular/core';
import { SailChecklist } from '../../../../api/src/types/sail-checklist/sail-checklist';
import { Sail } from '../../../../api/src/types/sail/sail';
import { PaginatedSailChecklist } from '../../../../api/src/types/sail-checklist/paginated-sail-checklist';

@Injectable({
  providedIn: 'root'
})
export class SailChecklistService {

  private readonly API_URL = '/api/checklist';

  constructor(@Inject(HttpClient) private http: HttpClient) { }

  public updateSailChecklists(sail_id: string, checklists): Observable<Sail> {
    return this.http.patch<Sail>(`${this.API_URL}/sail/${sail_id}/update`, checklists);
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

  public fetchAllPaginated(
    query?: any,
    page: number = 1,
    per_page: number = 10,
    sort: string = 'created_at,DESC'
  ): Observable<PaginatedSailChecklist> {
    return this.http
      .get<PaginatedSailChecklist>(`${this.API_URL}?s=${JSON.stringify(query || {})}&page=${page}&per_page=${per_page}&sort=${sort}`);
  }

}
