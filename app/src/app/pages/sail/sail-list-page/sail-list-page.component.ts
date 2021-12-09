import {
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

import {
  createSailRoute,
  sailChecklistsRoute,
  sailRequestsRoute,
} from '../../../routes/routes';
import { searchSails } from '../../../store/actions/sail.actions';
import { BasePageComponent } from '../../base-page/base-page.component';
import { Access } from '../../../../../../api/src/types/user-access/access';
import { SailStatus } from '../../../../../../api/src/types/sail/sail-status';
import { ProfileRole } from '../../../../../../api/src/types/profile/profile-role';
import { SailService } from '../../../services/sail.service';
import { UserAccessFields } from '../../../../../../api/src/types/user-access/user-access-fields';
import { STORE_SLICES } from '../../../store/store';

@Component({
  selector: 'app-sail-list-page',
  styleUrls: ['./sail-list-page.component.css'],
  templateUrl: './sail-list-page.component.html',
})
export class SailListPageComponent extends BasePageComponent implements OnInit {
  public CREATE_SAIL_ROUTE = createSailRoute.toString();
  public VIEW_SAIL_REQUESTS_ROUTE = sailRequestsRoute.toString();
  public VIEW_SAIL_CHECKLISTS_ROUTE = sailChecklistsRoute.toString();
  public boatName: string;
  public sailEnd: string;
  public sailName: string;
  public sailStart: string;
  public sailStatus: SailStatus | 'ANY' = 'ANY';
  public sailStatusValues = { ...SailStatus, ANY: 'ANY' };
  public sailorName: string;

  constructor(
    @Inject(Router) router: Router,
    @Inject(Store) store: Store<any>,
    @Inject(SailService) private sailService: SailService,
  ) {
    super(store, undefined, router);
  }

  ngOnInit() {
    this.subscribeToStoreSliceWithUser(STORE_SLICES.SAILS);
  }

  public resetFilter() {
    this.boatName = null;
    this.sailEnd = null;
    this.sailName = null;
    this.sailStart = null;
    this.sailStatus = 'ANY';
    this.sailorName = null;
  }

  public goToViewSail(id: string): void {
    this.viewSail(id);
  }

  public get canDownload(): boolean {
    return this.user?.access[UserAccessFields.DownloadSails];
  }

  public download(): void {
    const query = this.buildQuery();

    this.sailService
      .download(query)
      .subscribe(
        (data: any) => {
          const blob = new Blob([data], { type: 'text/csv' });
          const date = new Date();

          const fileName = `sails-${date.getDate()}-${date.getMonth()}-${date.getFullYear()}.csv`;

          const link = document.createElement('a');

          link.href = window.URL.createObjectURL(blob);
          link.download = fileName;
          link.click();
        },
        error => console.log('download error', error),
      );
  }

  public fetchSails(notify = false): void {
    const query = this.buildQuery();

    this.dispatchAction(searchSails({ notify, query }));
  }

  private buildQuery() {
    const query = {} as any;

    if (this.sailName) {
      query.sailName = this.sailName;
    }

    if (this.sailStart) {
      query.sailStart = new Date(`${this.sailStart}T00:00:00`).toISOString();
    }

    if (this.sailEnd) {
      query.sailEnd = new Date(`${this.sailEnd}T23:59:59`).toISOString();
    }

    if (this.boatName) {
      query.boatName = this.boatName;
    }

    if (this.sailorName) {
      query.sailorNames = this.sailorName.split(',').map(name => name.trim());
    }

    if (this.sailStatus && this.sailStatus !== 'ANY') {
      query.sailStatus = this.sailStatus;
    }

    return query;
  }

  public get shouldShowControls(): boolean {
    const user = this.user;

    if (!user) {
      return false;
    }

    const roles: string[] = user.roles || [];
    const access: Access = user.access || {};

    const should = access[UserAccessFields.CreateSail] ||
      roles.some(role => role === ProfileRole.Admin || role === ProfileRole.Coordinator);

    return should;
  }

}
