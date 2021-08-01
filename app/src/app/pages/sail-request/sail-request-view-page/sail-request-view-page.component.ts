import { Component, Inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { SailRequestStatus } from '../../../../../../api/src/types/sail-request/sail-request-status';
import { UserAccessFields } from '../../../../../../api/src/types/user-access/user-access-fields';
import { editSailRequestRoute, viewSailRoute } from '../../../routes/routes';
import { cancelSailRequest } from '../../../store/actions/sail-request.actions';
import { SailRequestBasePageComponent } from '../sail-request-base-page/sail-request-base-page.component';

@Component({
  selector: 'app-sail-request-view-page',
  templateUrl: './sail-request-view-page.component.html',
  styleUrls: ['./sail-request-view-page.component.css']
})
export class SailRequestViewPageComponent extends SailRequestBasePageComponent {

  constructor(
    @Inject(ActivatedRoute) route: ActivatedRoute,
    @Inject(MatDialog) dialog: MatDialog,
    @Inject(Router) router: Router,
    @Inject(Store) store: Store<any>,

  ) {
    super(store, route, router, dialog);
  }

  public viewSail(sail_id: string) {
    this.goTo([viewSailRoute(sail_id)]);
  }

  public get editSailRequestRoute(): string {
    return editSailRequestRoute(this.sail_request_id);
  }

  public get canEditRequest(): boolean {

    if (this.sailRequest.status === SailRequestStatus.Scheduled) {
      return false;
    }

    if (this.user.profile.id === this.sailRequest.requested_by_id) {
      return true;
    }

    return !!this.user.access[UserAccessFields.EditSailRequest];
  }

  public get canCancelRequest(): boolean {
    return this.sailRequest.status !== SailRequestStatus.Cancelled && this.canEditRequest;
  }

  public cancelRequest(): void {
    this.dispatchAction(cancelSailRequest({ id: this.sail_request_id }));
  }
}
