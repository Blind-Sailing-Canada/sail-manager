import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {
  Inject,
  Injectable,
} from '@angular/core';
import { PaymentCapture } from '../../../../api/src/types/payment-capture/payment-capture';
import { PaginatedPaymentCapture } from '../../../../api/src/types/payment-capture/paginated-payment-capture';
import { ManualCredit } from '../../../../api/src/types/payment-capture/manual-credit';

@Injectable({
  providedIn: 'root'
})
export class PaymentCaptureService {

  private readonly API_URL = '/api/payment-capture';

  constructor(@Inject(HttpClient) private http: HttpClient) { }

  createManualCredit(credit: ManualCredit): Observable<PaymentCapture> {
    return this.http.post<PaymentCapture>(`${this.API_URL}/manual_credit`, credit);
  }

  updatePayment(id: string, payment: Partial<PaymentCapture>): Observable<PaymentCapture> {
    return this.http.patch<PaymentCapture>(`${this.API_URL}/${id}`, payment);
  }

  deletePayment(id: string) {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }

  fetchPaymentCapture(payment_capture_id: string): Observable<PaymentCapture> {
    return this.http.get<PaymentCapture>(`${this.API_URL}/${payment_capture_id}`);
  }

  assignToUser(payment_capture_id: string, profile_id: string): Observable<PaymentCapture> {
    return this.http.post<PaymentCapture>(`${this.API_URL}/${payment_capture_id}/assign`, { profile_id });
  }

  fetchAllPaginated(
    query?: any,
    page: number = 1,
    per_page: number = 10,
    sort: string = 'created_at,ASC'
  ): Observable<PaginatedPaymentCapture> {
    return this.http
      .get<PaginatedPaymentCapture>(
        `${this.API_URL}`,
        { params: {
          s: JSON.stringify(query || {}),
          page,
          per_page,
          sort },
        });
  }
}
