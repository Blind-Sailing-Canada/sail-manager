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
import { firstValueFrom } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { FilterInfo } from '../../../models/filter-into';
import { DEFAULT_PAGINATION } from '../../../models/default-pagination';
import { WindowService } from '../../../services/window.service';
import { Profile } from '../../../../../../api/src/types/profile/profile';
import { createPurchaseRoute, listPurchasesRoute, viewProfileRoute, viewSailRoute } from '../../../routes/routes';
import { SailPaymentClaim } from '../../../../../../api/src/types/sail-payment-claim/sail-payment-claim';
import { PaginatedSailPaymentClaim } from '../../../../../../api/src/types/sail-payment-claim/paginated-sail-payment-claim';
import { SailPaymentClaimService } from '../../../services/sail-payment-claim.service';
import { ProfileRole } from '../../../../../../api/src/types/profile/profile-role';

@Component({
  selector: 'app-purchase-outstanding-page',
  templateUrl: './purchase-outstanding-page.component.html',
  styleUrls: ['./purchase-outstanding-page.component.scss']
})
export class PurchaseOutstandingPageComponent extends BasePageComponent implements OnInit {
  public createPurchaseRoute = createPurchaseRoute;
  public dataSource = new MatTableDataSource<SailPaymentClaim>([]);
  public displayedColumns: string[] = [
    'sail.entity_number',
    'sail.name',
    'profile.name',
    'guest_name',
    'sail.start_at',
    'action',
  ];
  public displayedColumnsMobile: string[] = ['sail.entity_number'];
  public filterInfo: FilterInfo = { search: '', pagination: { ...DEFAULT_PAGINATION }, sort: 'created_at,ASC' };
  public paginatedData: PaginatedSailPaymentClaim;
  public viewSailRoute = viewSailRoute;
  public viewProfileRoute = viewProfileRoute;
  public listPurchasesRoute = listPurchasesRoute;

  constructor(
    @Inject(Store) store: Store<any>,
    @Inject(ActivatedRoute) route: ActivatedRoute,
    @Inject(Router) router: Router,
    @Inject(SailPaymentClaimService) private sailClaimService: SailPaymentClaimService,
    @Inject(WindowService) public windowService: WindowService,
  ) {
    super(store, route, router);
  }

  ngOnInit(): void {
    this.subscribeToStoreSliceWithUser(STORE_SLICES.PROFILES);

    this.filterSailClaims();
  }

  public get profile_id(): string {
    return this.route.snapshot.params.profile_id;
  }

  public get profile(): Profile {
    return this.getProfile(this.profile_id);
  }

  public async filterSailClaims(): Promise<void> {
    const { search, sort, pagination } = this.filterInfo;

    const query: any = { $and: [] };

    if (this.profile_id) {
      query.$and.push({ profile_id: this.profile_id, product_purchase_id: null });
    }

    if (search) {
      query.$and.push({
        $or: [
          { 'profile.name': { $contL: search } },
          { 'profile.email': { $contL: search } },
          { guest_name: { $contL: search } },
          { guest_email: { $contL: search } },
        ]
      });
    }

    this.startLoading();

    const fetcher = this.sailClaimService.fetchAllPaginated(query, pagination.pageIndex + 1, pagination.pageSize, sort);
    this.paginatedData = await firstValueFrom(fetcher).finally(() => this.finishLoading());
    this.dataSource.data = this.paginatedData.data;

    const page = this.paginatedData;

    this.dispatchMessage(`Displaying ${page.count} of ${page.total} sail claims on page #${page.page}.`);
  }

  public filterHandler(event: FilterInfo): void {
    this.filterInfo = event;

    this.filterSailClaims();
  }

  public get showAddManualPayment(): boolean {
    return this.user.roles.includes(ProfileRole.Admin);
  }

}
