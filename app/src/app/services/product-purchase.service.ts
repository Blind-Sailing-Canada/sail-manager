import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {
  Inject,
  Injectable,
} from '@angular/core';
import { ProductPurchase } from '../../../../api/src/types/product-purchase/product-purchase';
import { PaginatedProductPurchase } from '../../../../api/src/types/product-purchase/paginated-product-purchase';

@Injectable({
  providedIn: 'root'
})
export class ProductPurchaseService {

  private readonly API_URL = '/api/product-purchase';

  constructor(@Inject(HttpClient) private http: HttpClient) { }

  fetchProductPurchase(purchase_id: string): Observable<ProductPurchase> {
    return this.http.get<ProductPurchase>(`${this.API_URL}/${purchase_id}`);
  }

  fetchAllPaginated(
    query?: any,
    page: number = 1,
    per_page: number = 10,
    sort: string = 'created_at,ASC'
  ): Observable<PaginatedProductPurchase> {
    return this.http
      .get<PaginatedProductPurchase>(
        `${this.API_URL}`,
        { params: {
          s: JSON.stringify(query || {}),
          page,
          per_page,
          sort },
        });
  }
}
