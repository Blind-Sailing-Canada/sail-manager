import {
  AfterViewInit,
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { BasePageComponent } from '../../../base-page/base-page.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { WindowService } from '../../../../services/window.service';
import { PaymentCaptureService } from '../../../../services/payment-capture.service';
import { PaymentCapture } from '../../../../../../../api/src/types/payment-capture/payment-capture';
import { firstValueFrom } from 'rxjs';
import { FindUserDialogComponent } from '../../../../components/find-user-dialog/find-user-dialog.component';
import { FindUserDialogData } from '../../../../models/find-user-dialog-data.interface';
import { ProfileService } from '../../../../services/profile.service';
import { Profile } from '../../../../../../../api/src/types/profile/profile';
import { RootRoutes, SubRoutes, viewProfileRoute, viewSailRoute } from '../../../../routes/routes';
import { SailPaymentClaim } from '../../../../../../../api/src/types/sail-payment-claim/sail-payment-claim';
import { MatTableDataSource } from '@angular/material/table';
import { FilterInfo } from '../../../../models/filter-into';
import { DEFAULT_PAGINATION } from '../../../../models/default-pagination';
import { PaginatedSailPaymentClaim } from '../../../../../../../api/src/types/sail-payment-claim/paginated-sail-payment-claim';
import { SailPaymentClaimService } from '../../../../services/sail-payment-claim.service';

@Component({
  selector: 'app-admin-payment-view-page',
  templateUrl: './admin-payment-view-page.component.html',
  styleUrls: ['./admin-payment-view-page.component.scss']
})
export class AdminPaymentViewPageComponent extends BasePageComponent implements OnInit, AfterViewInit {
  private findUserDialogRef: MatDialogRef<FindUserDialogComponent>;
  private foundUsers: Profile[] = [];
  private paymentId: string;
  public payment: PaymentCapture;
  public viewProfileRoute = viewProfileRoute;
  public viewSailRoute = viewSailRoute;
  public dataSource = new MatTableDataSource<SailPaymentClaim>([]);
  public displayedColumns: string[] = [
    'sail.entity_number',
    'profile.name',
    'created_at',
  ];
  public displayedColumnsMobile: string[] = ['product'];
  public filterInfo: FilterInfo = { search: '', pagination: DEFAULT_PAGINATION, sort: 'created_at,ASC' };
  public paginatedData: PaginatedSailPaymentClaim;
  public editPaymentRoute = (id: string) => `/${RootRoutes.ADMIN}/${SubRoutes.EDIT_ADMIN_PAYMENT}/${id}`;

  constructor(
    @Inject(Store) store: Store<any>,
    @Inject(Router) router: Router,
    @Inject(ActivatedRoute) route: ActivatedRoute,
    @Inject(MatDialog) dialog: MatDialog,
    @Inject(WindowService) public windowService: WindowService,
    @Inject(PaymentCaptureService) private paymentCaptureService: PaymentCaptureService,
    @Inject(ProfileService) private profileService: ProfileService,
    @Inject(SailPaymentClaimService) private sailPaymentClaimService: SailPaymentClaimService,
  ) {
    super(store, route, router, dialog);
  }

  ngOnInit() {
    if (!this.user) {
      return;
    }

    this.paymentId = this.route.snapshot.params.id;

    if (this.paymentId) {
      this.fetchPayment(this.paymentId);
      this.filterSailPaymentClaims();
    }

  }

  public showFindUserDialog(): void {
    const dialogData: FindUserDialogData = {
      complete: user => this.addUser(user),
      users: this.foundUsers,
      searchUsers: queryString => this.searchUsers(queryString),
    };

    this.findUserDialogRef = this.dialog
      .open(FindUserDialogComponent, {
        width: '90%',
        maxWidth: 500,
        data: dialogData,
      });
  }

  private async addUser(user: Profile) {
    this.paymentCaptureService.assignToUser(this.paymentId, user.id);

    this.startLoading();

    try {
      this.payment = await firstValueFrom(this.paymentCaptureService.assignToUser(this.paymentId, user.id))
        .finally(() => this.finishLoading());
      this.dispatchMessage(`Assigned to user: ${user.name} (${user.email})`);
    } catch (error) {
      this.dispatchError(`Failed to assign to user: ${error.message}`);
      throw error;
    }
  }

  private async searchUsers(queryString: string) {
    this.startLoading();

    this.foundUsers = await firstValueFrom(
      this.profileService.searchByNameOrEmail(queryString, 5))
      .finally(() => this.finishLoading());

    if (this.findUserDialogRef && this.findUserDialogRef.componentInstance) {
      this.findUserDialogRef.componentInstance.data = {
        ...this.findUserDialogRef.componentInstance.data,
        users: this.foundUsers,
      };
    }
  }

  private async fetchPayment(id: string) {
    this.startLoading();

    this.payment = await firstValueFrom(this.paymentCaptureService.fetchPaymentCapture(id))
      .finally(() => this.finishLoading());
  }

  public async filterSailPaymentClaims(): Promise<void> {
    const { search, sort, pagination } = this.filterInfo;

    const query: any = { $and: [], 'product_purchase.payment_capture_id': this.paymentId };

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
