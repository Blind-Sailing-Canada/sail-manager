import {
  AfterViewInit,
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
import { EntityType } from '../../../models/entity-type';
import { DocumentBasePageComponent } from '../document-base-page/document-base-page';
import { PaginatedDocument } from '../../../../../../api/src/types/document/paginated-document';
import { MatTableDataSource } from '@angular/material/table';
import { DEFAULT_PAGINATION } from '../../../models/default-pagination';
import { DocumentService } from '../../../services/document.service';
import { firstValueFrom } from 'rxjs';
import { FilterInfo } from '../../../models/filter-into';
import { WindowService } from '../../../services/window.service';

@Component({
  selector: 'app-document-list-page',
  templateUrl: './document-list-page.component.html',
  styleUrls: ['./document-list-page.component.css']
})
export class DocumentListPageComponent extends DocumentBasePageComponent implements OnInit, AfterViewInit {

  public dataSource = new MatTableDataSource<Document>([]);
  public displayedColumns: string[] = ['title', 'documentable_type', 'created_at', 'download'];
  public displayedColumnsMobile: string[] = ['title'];
  public filterInfo: FilterInfo = { search: '', pagination: DEFAULT_PAGINATION, sort: 'title,ASC' };
  public paginatedData: PaginatedDocument;

  constructor(
    @Inject(Store) store: Store<any>,
    @Inject(Router) router: Router,
    @Inject(MatDialog) dialog: MatDialog,
    @Inject(ActivatedRoute) route: ActivatedRoute,
    @Inject(WindowService) public windowService: WindowService,
    private documentSErvice: DocumentService,
  ) {
    super(store, route, router, dialog);
  }

  ngOnInit() {
    super.ngOnInit();

    if (!this.user) {
      return;
    }

    this.filterDocuments();
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

  public async filterDocuments(): Promise<void> {
    const { search, sort, pagination } = this.filterInfo;
    const query = { $and: [] };

    if (search) {
      query.$and.push({ $or: [
        { title: { $contL: search } },
        { description: { $contL: search } },
        { 'author.name': { $contL: search } },
      ] });
    }

    if (this.entity_type && this.entity_id) {
      query.$and.push({ documentable_id: this.entity_id });
      query.$and.push({ documentable_type: this.entity_type });
    }

    this.startLoading();

    const mediaFetch =  this.documentSErvice.fetchAllPaginated(query, pagination.pageIndex + 1, pagination.pageSize, sort);
    this.paginatedData = await firstValueFrom(mediaFetch).finally(() => this.finishLoading());
    this.dataSource.data = this.paginatedData.data;

    const page = this.paginatedData;

    this.dispatchMessage(`Displaying ${page.count} of ${page.total} documents on page #${page.page}.`);
  }

  public getEntityLabel(entityName: string): string {
    return entityName ? entityName.replace('Entity', ''): '';
  }

  public filterHandler(event: FilterInfo): void {
    this.filterInfo = event;

    this.filterDocuments();
  }
}
