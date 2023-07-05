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
import { ProductPurchaseService } from '../../../services/product-purchase.service';
import { PaginatedProductPurchase } from '../../../../../../api/src/types/product-purchase/paginated-product-purchase';
import { ProductPurchase } from '../../../../../../api/src/types/product-purchase/product-purchase';
import { MatTableDataSource } from '@angular/material/table';
import { FilterInfo } from '../../../models/filter-into';
import { DEFAULT_PAGINATION } from '../../../models/default-pagination';
import { WindowService } from '../../../services/window.service';
import { Profile } from '../../../../../../api/src/types/profile/profile';
import { createPurchaseRoute, viewPurchaseRoute } from '../../../routes/routes';
import { ProfileRole } from '../../../../../../api/src/types/profile/profile-role';

@Component({
  selector: 'app-purchase-list-page',
  templateUrl: './purchase-list-page.component.html',
  styleUrls: ['./purchase-list-page.component.scss']
})
export class PurchaseListPageComponent extends BasePageComponent implements OnInit {
  public createPurchaseRoute = createPurchaseRoute;
  public dataSource = new MatTableDataSource<ProductPurchase>([]);
  public displayedColumns: string[] = [
    'product_name',
    'number_of_sails_included',
    'number_of_sails_used',
    'number_of_guest_sails_included',
    'number_of_guest_sails_used',
    'valid_until',
    'created_at',
    'action',
  ];
  public displayedColumnsMobile: string[] = ['created_at'];
  public filterInfo: FilterInfo = { search: '', pagination: DEFAULT_PAGINATION, sort: 'created_at,DESC' };
  public paginatedData: PaginatedProductPurchase;
  public viewPurchaseRoute = viewPurchaseRoute;

  constructor(
    @Inject(Store) store: Store<any>,
    @Inject(ActivatedRoute) route: ActivatedRoute,
    @Inject(Router) router: Router,
    @Inject(ProductPurchaseService) private productPurchaseService: ProductPurchaseService,
    @Inject(WindowService) public windowService: WindowService,
  ) {
    super(store, route, router);
  }

  ngOnInit(): void {
    this.subscribeToStoreSliceWithUser(STORE_SLICES.PROFILES);
    this.filterProducts();
  }

  public get profile_id(): string {
    return this.route.snapshot.queryParams.profile_id;
  }

  public get showAddManualPayment(): boolean {
    return this.user.roles.includes(ProfileRole.Admin);
  }

  public get profile(): Profile {
    return this.getProfile(this.profile_id);
  }

  public async filterProducts(): Promise<void> {
    const { search, sort, pagination } = this.filterInfo;

    const query: any = { $and: [] };

    if (this.profile_id) {
      query.$and.push({ profile_id: this.profile_id });
    }

    if (search) {
      query.$and.push({ $or: [
        { product_name: { $contL: search } },
        { 'profile.name': { $contL: search } },
        { 'profile.email': { $contL: search } },
      ] });
    }

    this.startLoading();

    const fetcher =  this.productPurchaseService.fetchAllPaginated(query, pagination.pageIndex + 1, pagination.pageSize, sort);
    this.paginatedData = await firstValueFrom(fetcher).finally(() => this.finishLoading());
    this.dataSource.data = this.paginatedData.data;

    const page = this.paginatedData;

    this.dispatchMessage(`Displaying ${page.count} of ${page.total} products on page #${page.page}.`);
  }

  public filterHandler(event: FilterInfo): void {
    this.filterInfo = event;

    this.filterProducts();
  }

}
