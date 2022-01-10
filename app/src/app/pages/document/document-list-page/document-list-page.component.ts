import {
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Document } from '../../../../../../api/src/types/document/document';
import { Boat } from '../../../../../../api/src/types/boat/boat';
import { Challenge } from '../../../../../../api/src/types/challenge/challenge';
import { UserAccessFields } from '../../../../../../api/src/types/user-access/user-access-fields';
import {
  createDocumentRoute,
  viewDocumentRoute,
} from '../../../routes/routes';
import { fetchDocuments } from '../../../store/actions/document.actions';
import { STORE_SLICES } from '../../../store/store';
import { EntityType } from '../../../models/entity-type';
import { DocumentBasePageComponent } from '../document-base-page/document-base-page';

@Component({
  selector: 'app-document-list-page',
  templateUrl: './document-list-page.component.html',
  styleUrls: ['./document-list-page.component.css']
})
export class DocumentListPageComponent extends DocumentBasePageComponent implements OnInit {

  public documentsArray: Document[] = [];

  constructor(
    @Inject(Store) store: Store<any>,
    @Inject(Router) router: Router,
    @Inject(MatDialog) dialog: MatDialog,
    @Inject(ActivatedRoute) route: ActivatedRoute,
  ) {
    super(store, route, router, dialog);
  }

  ngOnInit() {
    super.ngOnInit();

    if (!this.user) {
      return;
    }

    this.subscribeToStoreSliceWithUser(STORE_SLICES.DOCUMENTS, () => {
      const documents = (this.store[STORE_SLICES.DOCUMENTS] || {});
      this.documentsArray = Object
        .values<Document>(documents)
        .filter(document => !!document)
        .filter(document => this.entity_id ? document.documentable_id === this.entity_id : document);
    });

    this.fetchDocuments(true);
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
        return `Boat: ${(this.entity as Challenge)?.name}`;
      default:
        return '';
    }
  }

  public get shouldEnableNewButton(): boolean {
    return !!this.user.access[UserAccessFields.CreateDocument];
  }

  public goToNewDocument(): void {
    if (this.entity_id) {
      this.goTo([createDocumentRoute], {
        queryParams: { entity_type: this.entity_type, entity_id: this.entity_id },
      });
    } else {
      this.goTo([createDocumentRoute]);
    }
  }

  public viewDocument(documentId: string): void {
    this.goTo([viewDocumentRoute(documentId)]);
  }

  private fetchDocuments(notify?: boolean): void {
    this.dispatchAction(fetchDocuments({ entity_type: this.entity_type, entity_id: this.entity_id, notify }));
  }
}
