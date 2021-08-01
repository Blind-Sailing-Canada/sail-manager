import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {
  Inject,
  Injectable,
} from '@angular/core';
import { SailCategory } from '../../../../api/src/types/sail/sail-category';

@Injectable({
  providedIn: 'root'
})
export class SailCategoryService {

  private readonly API_URL = '/api/sail/category';

  constructor(@Inject(HttpClient) private http: HttpClient) { }

  public fetchAll(): Observable<SailCategory[]> {
    return this.http.get<SailCategory[]>(`${this.API_URL}`);
  }

  public create(category: Partial<SailCategory>): Observable<SailCategory> {
    return this.http.post<SailCategory>(`${this.API_URL}`, category);
  }

  public delete(sailRequestId: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${sailRequestId}`);
  }

}
