import {
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Document } from '../../../../../../api/src/types/document/document';
import { UserAccessFields } from '../../../../../../api/src/types/user-access/user-access-fields';
import {
  createDocumentRoute,
  viewDocumentRoute,
} from '../../../routes/routes';
import { fetchDocuments } from '../../../store/actions/document.actions';
import { STORE_SLICES } from '../../../store/store';
import { BasePageComponent } from '../../base-page/base-page.component';

@Component({
  selector: 'app-document-list-page',
  templateUrl: './document-list-page.component.html',
  styleUrls: ['./document-list-page.component.css']
})
export class DocumentListPageComponent extends BasePageComponent implements OnInit {

  public documentsArray: Document[] = [];

  constructor(
    @Inject(Store) store: Store<any>,
    @Inject(Router) router: Router,
    @Inject(MatDialog) dialog: MatDialog,
  ) {
    super(store, undefined, router, dialog);
  }

  ngOnInit() {
    if (!this.user) {
      return;
    }

    this.subscribeToStoreSliceWithUser(STORE_SLICES.PROFILES);
    this.subscribeToStoreSliceWithUser(STORE_SLICES.DOCUMENTS, () => {
      const documents = (this.store[STORE_SLICES.DOCUMENTS] || {});
      this.documentsArray = Object.values(documents).filter(document => !!document) as Document[];
    });

    this.fetchDocuments(false);
  }

  public get shouldEnableNewButton(): boolean {
    return !!this.user.access[UserAccessFields.CreateDocument];
  }

  public goToNewDocument(): void {
    this.goTo([createDocumentRoute]);
  }

  public viewDocument(documentId: string): void {
    this.goTo([viewDocumentRoute(documentId)]);
  }

  private fetchDocuments(notify?: boolean): void {
    this.dispatchAction(fetchDocuments({ notify }));
  }
}
