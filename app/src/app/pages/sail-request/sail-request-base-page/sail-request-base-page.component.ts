import {
  Component,
  OnInit,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
  ActivatedRoute,
  Router,
} from '@angular/router';
import { Store } from '@ngrx/store';
import { SailRequest } from '../../../../../../api/src/types/sail-request/sail-request';
import { STORE_SLICES } from '../../../store/store';
import { BasePageComponent } from '../../base-page/base-page.component';

@Component({
  template: ''
})
export class SailRequestBasePageComponent extends BasePageComponent implements OnInit {

  constructor(
    store: Store<any>,
    route: ActivatedRoute,
    router: Router,
    dialog?: MatDialog,
  ) {
    super(store, route, router, dialog);
  }

  ngOnInit() {
    this.subscribeToStoreSliceWithUser(STORE_SLICES.PROFILES);
    this.subscribeToStoreSliceWithUser(STORE_SLICES.SAIL_REQUESTS);
  }

  public get sail_request_id(): string {
    return this.route.snapshot.params.id;
  }

  public get sailRequest(): SailRequest {
    const id = this.sail_request_id;

    if (!id) {
      return;
    }

    return this.getSailRequest(id);
  }

}
