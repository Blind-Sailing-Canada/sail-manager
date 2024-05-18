import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {
  Inject,
  Injectable,
} from '@angular/core';
import { SailPaymentClaim } from '../../../../api/src/types/sail-payment-claim/sail-payment-claim';
import { PaginatedSailPaymentClaim } from '../../../../api/src/types/sail-payment-claim/paginated-sail-payment-claim';

@Injectable({
  providedIn: 'root'
})
export class SailPaymentClaimService {

  private readonly API_URL = '/api/sail-payment-claim';

  constructor(@Inject(HttpClient) private http: HttpClient) { }

  fetchSailPaymentClaim(id: string): Observable<SailPaymentClaim> {
    return this.http.get<SailPaymentClaim>(`${this.API_URL}/${id}`);
  }

  fetchAllPaginated(
    query?: any,
    page: number = 1,
    per_page: number = 10,
    sort: string = 'created_at,ASC',
    dashboard: boolean = false,
  ): Observable<PaginatedSailPaymentClaim> {
    return this.http
      .get<PaginatedSailPaymentClaim>(
        `${this.API_URL}`,
        { params: {
          s: JSON.stringify(query || {}),
          page,
          per_page,
          dashboard,
          sort },
        });
  }
}
