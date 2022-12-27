import {
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import {
  ActivatedRoute,
  Router,
} from '@angular/router';
import { Store } from '@ngrx/store';
import { STORE_SLICES } from '../../../store/store';
import { BasePageComponent } from '../../base-page/base-page.component';
import { ProductPurchaseService } from '../../../services/product-purchase.service';
import { ProductPurchase } from '../../../../../../api/src/types/product-purchase/product-purchase';
import { WindowService } from '../../../services/window.service';
import { firstValueFrom } from 'rxjs';
import { viewProfileRoute, viewSailRoute } from '../../../routes/routes';
import { SailPaymentClaimService } from '../../../services/sailpayment-claim.service';
import { SailPaymentClaim } from '../../../../../../api/src/types/sail-payment-claim/sail-payment-claim';
import { MatTableDataSource } from '@angular/material/table';
import { FilterInfo } from '../../../models/filter-into';
import { DEFAULT_PAGINATION } from '../../../models/default-pagination';
import { PaginatedSailPaymentClaim } from '../../../../../../api/src/types/sail-payment-claim/paginated-sail-payment-claim';

@Component({
  selector: 'app-purchase-view-page',
  templateUrl: './purchase-view-page.component.html',
  styleUrls: ['./purchase-view-page.component.scss']
})
export class PurchaseViewPageComponent extends BasePageComponent implements OnInit {
  public purchase: ProductPurchase;
  public viewProfileRoute = viewProfileRoute;
  public viewSailRoute = viewSailRoute;
  public dataSource = new MatTableDataSource<SailPaymentClaim>([]);
  public displayedColumns: string[] = [
    'sail.entity_number',
    'sailor',
    'created_at',
  ];
  public displayedColumnsMobile: string[] = ['product'];
  public filterInfo: FilterInfo = { search: '', pagination: DEFAULT_PAGINATION, sort: 'created_at,ASC' };
  public paginatedData: PaginatedSailPaymentClaim;

  constructor(
    @Inject(Store) store: Store<any>,
    @Inject(ActivatedRoute) route: ActivatedRoute,
    @Inject(Router) router: Router,
    @Inject(ProductPurchaseService) private productPurchaseService: ProductPurchaseService,
    @Inject(SailPaymentClaimService) private sailPaymentClaimService: SailPaymentClaimService,
    @Inject(WindowService) public windowService: WindowService,
  ) {
    super(store, route, router);
  }

  ngOnInit(): void {
    this.subscribeToStoreSliceWithUser(STORE_SLICES.PROFILES);
    this.fetchPurchase();
    this.filterSailPaymentClaims();
  }

  public get purchase_id(): string {
    return this.route.snapshot.params.id;
  }

  private async fetchPurchase() {
    this.startLoading();

    this.purchase = await firstValueFrom(this.productPurchaseService.fetchProductPurchase(this.purchase_id))
      .finally(() => this.finishLoading());

    if (!this.purchase) {
      return;
    }

  }

  public async filterSailPaymentClaims(): Promise<void> {
    const { search, sort, pagination } = this.filterInfo;

    const query: any = { $and: [], product_purchase_id: this.purchase_id };

    if (search) {
      query.$and.push({ $or: [
        { 'product_purchase.product_name': { $contL: search } },
        { 'sail.name': { $contL: search } },
        Number.isInteger(+search) ? { 'sail.entity_number': +search } : undefined,
        { guest_name: { $contL: search } },
        { guest_email: { $contL: search } },
      ].filter(Boolean) });
    }

    this.startLoading();

    const fetcher =  this.sailPaymentClaimService.fetchAllPaginated(query, pagination.pageIndex + 1, pagination.pageSize, sort);
    this.paginatedData = await firstValueFrom(fetcher).finally(() => this.finishLoading());
    this.dataSource.data = this.paginatedData.data;

    const page = this.paginatedData;

    this.dispatchMessage(`Displaying ${page.count} of ${page.total} sail claims on page #${page.page}.`);
  }

  public filterHandler(event: FilterInfo): void {
    this.filterInfo = event;

    this.filterSailPaymentClaims();
  }

}
