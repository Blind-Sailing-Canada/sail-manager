import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {
  Inject,
  Injectable,
} from '@angular/core';
import { SailFeedback } from '../../../../api/src/types/sail-feedback/sail-feedback';
import { PaginatedSailFeedback } from '../../../../api/src/types/sail-feedback/paginated-sail-feedback';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {
  private readonly API_URL = '/api/sail-feedback';

  constructor(@Inject(HttpClient) private http: HttpClient) { }

  public submitFeedback(feedback: Partial<SailFeedback>): Observable<SailFeedback> {
    return this.http.post<SailFeedback>(this.API_URL, feedback);
  }

  public fetchFeedbacksForSail(sail_id: string): Observable<SailFeedback[]> {
    return this.http.get<SailFeedback[]>(`${this.API_URL}?sail_id=${sail_id}`);
  }

  public fetchFeedback(id: string): Observable<SailFeedback> {
    return this.http.get<SailFeedback>(`${this.API_URL}/${id}`);
  }

  fetchAllPaginated(
    query?: any,
    page: number = 1,
    per_page: number = 10,
    sort: string = 'created_at,ASC'
  ): Observable<PaginatedSailFeedback> {
    return this.http
      .get<PaginatedSailFeedback>(
        `${this.API_URL}`,
        { params: {
          s: JSON.stringify(query || {}),
          page,
          per_page,
          sort },
        });
  }
}
