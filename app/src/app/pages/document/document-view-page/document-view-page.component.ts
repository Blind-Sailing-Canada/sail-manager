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
import { Boat } from '../../../../../../api/src/types/boat/boat';
import { Challenge } from '../../../../../../api/src/types/challenge/challenge';
import { Document } from '../../../../../../api/src/types/document/document';
import { ProfileRole } from '../../../../../../api/src/types/profile/profile-role';
import { UserAccessFields } from '../../../../../../api/src/types/user-access/user-access-fields';
import { EntityType } from '../../../models/entity-type';
import {
  editDocumentRoute, viewBoatRoute, viewChallengeRoute,
} from '../../../routes/routes';
import { deleteDocument } from '../../../store/actions/document.actions';
import { STORE_SLICES } from '../../../store/store';
import { BasePageComponent } from '../../base-page/base-page.component';

@Component({
  selector: 'app-document-view-page',
  templateUrl: './document-view-page.component.html',
  styleUrls: ['./document-view-page.component.css']
})
export class DocumentViewPageComponent extends BasePageComponent implements OnInit {

  public document: Document;
  public document_id: string;

  constructor(
    @Inject(Store) store: Store<any>,
    @Inject(ActivatedRoute) route: ActivatedRoute,
    @Inject(Router) router: Router,
    @Inject(MatDialog) dialog: MatDialog,
  ) {
    super(store, route, router, dialog);
  }

  ngOnInit() {
    if (!this.user) {
      return;
    }

    this.document_id = this.route.snapshot.params.document_id;

    this.subscribeToStoreSliceWithUser(STORE_SLICES.PROFILES);
    this.subscribeToStoreSliceWithUser(STORE_SLICES.BOATS);
    this.subscribeToStoreSliceWithUser(STORE_SLICES.CHALLENGES);
    this.subscribeToStoreSliceWithUser(STORE_SLICES.DOCUMENTS, () => {
      this.document = (this.store[STORE_SLICES.DOCUMENTS] || {})[this.document_id];

      if (this.document_id && this.document === undefined) {
        this.document = this.getDocument(this.document_id);
      }
    });
  }

  public get shouldEnableEditButton(): boolean {
    return !!this.user.access[UserAccessFields.EditDocument]
      || this.user.profile.id === this.document.author_id
      || this.user.roles.includes(ProfileRole.Admin);
  }

  public editDocument(): void {
    this.goTo([editDocumentRoute(this.document_id)]);
  }

  public get entity(): null | undefined | Boat | Challenge {
    switch (this.document?.documentable_type) {
      case EntityType.Boat:
        return this.getBoat(this.document?.documentable_id);
      case EntityType.Challenge:
        return this.getChallenge(this.document?.documentable_id);
      default:
        return null;
    }
  }

  public get assignedTo(): string {
    switch (this.document?.documentable_type) {
      case EntityType.Boat:
        return `Boat: ${this.entity?.name}`;
      case EntityType.Challenge:
        return `Challenge: ${this.entity?.name}`;
      default:
        return '';
    }
  }

  public goToEntity(): void {
    switch (this.document?.documentable_type) {
      case EntityType.Boat:
        this.goTo([viewBoatRoute(this.document.documentable_id)]);
        break;
      case EntityType.Challenge:
        this.goTo([viewChallengeRoute(this.document.documentable_id)]);
        break;
      default:
        break;
    }
  }

  public delete(): void {
    this.dispatchAction(deleteDocument({document_id: this.document_id}));
  }

}
