import {
  AfterViewInit,
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { BasePageComponent } from '../../../base-page/base-page.component';
import { WindowService } from '../../../../services/window.service';
import { firstValueFrom } from 'rxjs';
import { createPurchaseRoute, outstandingPurchasesRoute, viewProfileRoute, viewSailRoute } from '../../../../routes/routes';
import { SailPaymentClaim } from '../../../../../../../api/src/types/sail-payment-claim/sail-payment-claim';
import { MatTableDataSource } from '@angular/material/table';
import { FilterInfo } from '../../../../models/filter-into';
import { DEFAULT_PAGINATION } from '../../../../models/default-pagination';
import { PaginatedSailPaymentClaim } from '../../../../../../../api/src/types/sail-payment-claim/paginated-sail-payment-claim';
import { SailPaymentClaimService } from '../../../../services/sail-payment-claim.service';

@Component({
  selector: 'app-admin-missing-sail-payments-page',
  templateUrl: './admin-missing-sail-payments-page.component.html',
  styleUrls: ['./admin-missing-sail-payments-page.component.scss']
})
export class AdminMissingSailPaymentsPageComponent extends BasePageComponent implements OnInit, AfterViewInit {
  public createPurchaseRoute = createPurchaseRoute;
  public viewProfileRoute = viewProfileRoute;
  public viewSailRoute = viewSailRoute;
  public outstandingPurchasesRoute = outstandingPurchasesRoute;
  public dataSource = new MatTableDataSource<SailPaymentClaim>([]);
  public displayedColumns: string[] = [
    'sail.entity_number',
    'sail.name',
    'profile.name',
    'guest_name',
    'created_at',
    'actions',
  ];
  public displayedColumnsMobile: string[] = ['created_at'];
  public filterInfo: FilterInfo = { search: '', pagination: { ...DEFAULT_PAGINATION }, sort: 'created_at,ASC' };
  public paginatedData: PaginatedSailPaymentClaim;

  constructor(
    @Inject(Store) store: Store<any>,
    @Inject(Router) router: Router,
    @Inject(ActivatedRoute) route: ActivatedRoute,
    @Inject(WindowService) public windowService: WindowService,
    @Inject(SailPaymentClaimService) private sailPaymentClaimService: SailPaymentClaimService,
  ) {
    super(store, route, router);
  }

  ngOnInit() {
    if (!this.user) {
      return;
    }

    this.filterSailPaymentClaims();
  }


  public async filterSailPaymentClaims(): Promise<void> {
    const { search, sort, pagination } = this.filterInfo;

    const query: any = { $and: [], product_purchase_id: null };

    if (search) {
      query.$and.push({
        $or: [
          { 'sail.name': { $contL: search } },
          Number.isInteger(+search) ? { 'sail.entity_number': +search } : undefined,
          { guest_name: { $contL: search } },
          { guest_email: { $contL: search } },
        ].filter(Boolean)
      });
    }

    this.startLoading();

    const fetcher = this.sailPaymentClaimService.fetchAllPaginated(query, pagination.pageIndex + 1, pagination.pageSize, sort);
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
