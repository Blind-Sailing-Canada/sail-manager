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
import { Document } from '../../../../../../api/src/types/document/document';
import { ProfileRole } from '../../../../../../api/src/types/profile/profile-role';
import { UserAccessFields } from '../../../../../../api/src/types/user-access/user-access-fields';
import {
  editDocumentRoute,
} from '../../../routes/routes';
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

}
