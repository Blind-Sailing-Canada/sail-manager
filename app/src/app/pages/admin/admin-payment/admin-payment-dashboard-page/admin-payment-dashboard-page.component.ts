import {
  AfterViewInit,
  Component,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { BasePageComponent } from '../../../base-page/base-page.component';
import { MatDialog } from '@angular/material/dialog';
import { WindowService } from '../../../../services/window.service';
import { PaymentCaptureService } from '../../../../services/payment-capture.service';
import { debounceTime, filter, firstValueFrom, fromEvent, map, takeWhile } from 'rxjs';
import { PaginatedPaymentCapture } from '../../../../../../../api/src/types/payment-capture/paginated-payment-capture';
import { FilterInfo } from '../../../../models/filter-into';
import { DEFAULT_PAGINATION } from '../../../../models/default-pagination';
import { MatTableDataSource } from '@angular/material/table';
import { PaymentCapture } from '../../../../../../../api/src/types/payment-capture/payment-capture';
import { createPurchaseRoute, viewAdminPaymentRoute, viewProfileRoute } from '../../../../routes/routes';
import { ProductType } from '../../../../../../../api/src/types/product-purchase/product-type';

@Component({
  selector: 'app-admin-payment-dashboard-page',
  templateUrl: './admin-payment-dashboard-page.component.html',
  styleUrls: ['./admin-payment-dashboard-page.component.scss']
})
export class AdminPaymentDashboardPageComponent extends BasePageComponent implements OnInit, AfterViewInit {
  public createPurchaseRoute = createPurchaseRoute;
  public dataSource = new MatTableDataSource<PaymentCapture>([]);
  public displayedColumns: string[] = ['product_name', 'customer_name', 'profile.name', 'created_at', 'action'];
  public displayedColumnsMobile: string[] = ['product_name'];
  public filterInfo: FilterInfo = { search: '', pagination: DEFAULT_PAGINATION, sort: 'created_at,ASC' };
  public paginatedData: PaginatedPaymentCapture;
  public productType: ProductType | 'ANY' = 'ANY';
  public productTypeValues = { ...ProductType, ANY: 'ANY' };
  public purchaseYear: number;
  public viewProfileRoute = viewProfileRoute;

  @ViewChild('purchaseYearInput', { static: false }) private purchaseYearInput;

  constructor(
    @Inject(Store) store: Store<any>,
    @Inject(Router) router: Router,
    @Inject(MatDialog) dialog: MatDialog,
    @Inject(WindowService) public windowService: WindowService,
    @Inject(PaymentCaptureService) private paymentCaptureService: PaymentCaptureService,
  ) {
    super(store, undefined, router, dialog);
  }

  ngOnInit() {
    if (!this.user) {
      return;
    }

    this.filterPayments();
  }

  ngAfterViewInit() {
    super.ngAfterViewInit();

    const typeAhead = fromEvent(this.purchaseYearInput.nativeElement, 'input')
      .pipe(
        takeWhile(() => this.active),
        map((event: any) => (event.target.value || '') as string),
        debounceTime(1000),
        map(text => text ? text.trim() : ''),
        filter(text => text === '' || (Number.isInteger(+text) && +text > 2000))
      );

    typeAhead
      .subscribe((year: string) => {
        this.purchaseYear = +year;
        this.filterPayments();
      });

  }

  public goToPaymentView(payment_id: string): void {
    this.goTo([viewAdminPaymentRoute(payment_id)]);
  }

  public async filterPayments(): Promise<void> {
    const { search, sort, pagination } = this.filterInfo;

    const query = { $and: [] };

    if (search) {
      query.$and.push({ $or: [
        { customer_name: { $contL: search } },
        { customer_email: { $contL: search } },
        { product_name: { $contL: search } },
        { 'profile.name': { $contL: search } },
        { 'profile.email': { $contL: search } },
      ] });
    }

    if (this.productType && this.productType !== 'ANY') {
      query.$and.push({ product_type: this.productType });
    }

    if (this.purchaseYear) {

      const startYear = new Date(this.purchaseYear, 0, 1, 0, 0, 0);
      const endYear = new Date(this.purchaseYear, 11, 31, 23, 59,59);

      query.$and.push({ created_at: { $gte: startYear } });
      query.$and.push({ created_at: { $lte: endYear } });
    }

    this.startLoading();

    const fetcher =  this.paymentCaptureService.fetchAllPaginated(query, pagination.pageIndex + 1, pagination.pageSize, sort);
    this.paginatedData = await firstValueFrom(fetcher).finally(() => this.finishLoading());
    this.dataSource.data = this.paginatedData.data;

    const page = this.paginatedData;

    this.dispatchMessage(`Displaying ${page.count} of ${page.total} payments on page #${page.page}.`);
  }

  public filterHandler(event: FilterInfo): void {
    this.filterInfo = event;

    this.filterPayments();
  }

}
