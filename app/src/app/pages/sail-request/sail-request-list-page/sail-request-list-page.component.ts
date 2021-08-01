import {
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
  ActivatedRoute,
  Router,
} from '@angular/router';
import { Store } from '@ngrx/store';
import { SailRequest } from '../../../../../../api/src/types/sail-request/sail-request';
import { SailRequestStatus } from '../../../../../../api/src/types/sail-request/sail-request-status';
import { UserAccessFields } from '../../../../../../api/src/types/user-access/user-access-fields';
import {
  createSailFromRequestRoute,
  createSailRequestRoute,
  editSailRequestRoute,
} from '../../../routes/routes';
import { SailRequestService } from '../../../services/sail-request.service';
import { interestedSailRequest, uninterestedSailRequest } from '../../../store/actions/sail-request-interest.actions';
import {
  cancelSailRequest,
  fetchSailRequests,
} from '../../../store/actions/sail-request.actions';
import { SailRequestBasePageComponent } from '../sail-request-base-page/sail-request-base-page.component';

@Component({
  selector: 'app-sail-request-list-page',
  templateUrl: './sail-request-list-page.component.html',
  styleUrls: ['./sail-request-list-page.component.css']
})
export class SailRequestListPageComponent extends SailRequestBasePageComponent implements OnInit {

  public expandedId: string = null;

  constructor(
    @Inject(Store) store: Store<any>,
    @Inject(ActivatedRoute) route: ActivatedRoute,
    @Inject(Router) router: Router,
    @Inject(MatDialog) dialog: MatDialog,
    @Inject(SailRequestService) private sailRequestService: SailRequestService,
  ) {
    super(store, route, router, dialog);
  }

  ngOnInit() {
    if (!this.user) {
      return;
    }

    super.ngOnInit();

    this.fetchNewRequests(false);
  }

  public setExpandedId(id: string): void {
    this.expandedId = id;
  }

  public fetchNewRequests(notify?: boolean): void {
    this.dispatchAction(fetchSailRequests({ notify, query: `filter=status||$eq||${SailRequestStatus.New}` }));
    this.dispatchAction(fetchSailRequests({ notify, query: `filter=status||$eq||${SailRequestStatus.Scheduled}&limit=20` }));
    this.dispatchAction(fetchSailRequests({ notify, query: `filter=status||$eq||${SailRequestStatus.Cancelled}&limit=10` }));
    this.dispatchAction(fetchSailRequests({ notify, query: `filter=status||$eq||${SailRequestStatus.Expired}&limit=10` }));
  }

  public get newSailRequestsArray(): SailRequest[] {
    return this.getSailRequestArray(SailRequestStatus.New);
  }

  public get scheduledSailRequestsArray(): SailRequest[] {
    return this.getSailRequestArray(SailRequestStatus.Scheduled);
  }

  public get expiredSailRequestsArray(): SailRequest[] {
    return this.getSailRequestArray(SailRequestStatus.Expired);
  }

  public get cancelledSailRequestsArray(): SailRequest[] {
    return this.getSailRequestArray(SailRequestStatus.Cancelled);
  }

  public get canDownload(): boolean {
    return this.user?.access[UserAccessFields.DownloadSailRequests];
  }

  public download(): void {
    this.sailRequestService
      .download()
      .subscribe(
        (data: any) => {
          const blob = new Blob([data], { type: 'text/csv' });
          const date = new Date();

          const fileName = `bsac-sail-requests-${date.getDate()}-${date.getMonth()}-${date.getFullYear()}.csv`;

          const link = document.createElement('a');

          link.href = window.URL.createObjectURL(blob);
          link.download = fileName;
          link.click();
        },
        error => console.log('download error', error),
      );
  }

  private getSailRequestArray(requestStatus: SailRequestStatus): SailRequest[] {
    const sailRequests = this.sailRequests;
    const array = Object
      .values(sailRequests)
      .filter(request => request.status === requestStatus)
      .sort((a, b) => {

        // NEW status should be top of the list
        if (a.status === SailRequestStatus.New && b.status !== SailRequestStatus.New) {
          return -1;
        }

        // NEW status should be top of the list
        if (b.status === SailRequestStatus.New && a.status !== SailRequestStatus.New) {
          return 1;
        }

        if (a.status < b.status) {
          return -1;
        }

        if (a.status > b.status) {
          return 1;
        }

        return 0;
      });

    return array;
  }

  public get createSailRequestRouteLink(): string {
    return createSailRequestRoute.toString();
  }

  public createSail(id: string): void {
    this.goTo([createSailFromRequestRoute(id)]);
  }

  public editSailRequest(id: string): void {
    this.goTo([editSailRequestRoute(id)]);
  }

  public joinSailRequest(id: string): void {
    this.dispatchAction(interestedSailRequest({ sail_request_id: id }));
  }

  public leaveSailRequest(id: string): void {
    this.dispatchAction(uninterestedSailRequest({ sail_request_id: id }));
  }

  public cancelRequest(id: string): void {
    this.dispatchAction(cancelSailRequest({ id }));
  }
}
