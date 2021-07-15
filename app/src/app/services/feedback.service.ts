import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {
  Inject,
  Injectable,
} from '@angular/core';
import { SailFeedback } from '../../../../api/src/types/sail-feedback/sail-feedback';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {
  private readonly API_URL = '/api/sail-feedback';

  constructor(@Inject(HttpClient) private http: HttpClient) { }

  public submitFeedback(feedback: Partial<SailFeedback>): Observable<SailFeedback> {
    return this.http.post<SailFeedback>(this.API_URL, feedback);
  }

  public fetchFeedbacksForSail(sailId: string): Observable<SailFeedback[]> {
    return this.http.get<SailFeedback[]>(`${this.API_URL}?sailId=${sailId}`);
  }

  public fetchFeedback(id: string): Observable<SailFeedback> {
    return this.http.get<SailFeedback>(`${this.API_URL}/${id}`);
  }
}
