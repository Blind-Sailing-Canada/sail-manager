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
import { Boat } from '../../../../../../api/src/types/boat/boat';
import { Challenge } from '../../../../../../api/src/types/challenge/challenge';
import { EntityType } from '../../../models/entity-type';
import { STORE_SLICES } from '../../../store/store';
import { BasePageComponent } from '../../base-page/base-page.component';

@Component({
  template: ''
})
export class DocumentBasePageComponent extends BasePageComponent implements OnInit {

  constructor(
    store: Store<any>,
    route: ActivatedRoute,
    router: Router,
    dialog?: MatDialog,
  ) {
    super(store, route, router, dialog);
  }

  ngOnInit() {
    this.subscribeToStoreSliceWithUser(STORE_SLICES.BOATS);
    this.subscribeToStoreSliceWithUser(STORE_SLICES.CHALLENGES);
    this.subscribeToStoreSliceWithUser(STORE_SLICES.PROFILES);
  }

  public get entity_type(): EntityType {
    return this.route.snapshot.queryParams.entity_type;
  }

  public get entity_id(): string {
    return this.route.snapshot.queryParams.entity_id;
  }

  public get entity(): null | undefined | Boat | Challenge {
    switch (this.entity_type) {
      case EntityType.Boat:
        return this.getBoat(this.entity_id);
      case EntityType.Challenge:
        return this.getChallenge(this.entity_id);
      default:
        return null;
    }
  }

  public get subheading(): string {
    switch(this.entity_type) {
      case EntityType.Boat:
        return `Boat: ${(this.entity as Boat)?.name}`;
      case EntityType.Challenge:
        return `Challenge: ${(this.entity as Challenge)?.name}`;
      default:
        return '';
    }
  }

}
