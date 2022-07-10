import {
  AfterViewInit,
  Component,
  Inject,
  OnInit,
  ViewChild,
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
import { Sort } from '@angular/material/sort';
import { PageEvent } from '@angular/material/paginator';
import { debounceTime, filter, firstValueFrom, fromEvent, map, switchMap, takeWhile } from 'rxjs';

@Component({
  selector: 'app-document-list-page',
  templateUrl: './document-list-page.component.html',
  styleUrls: ['./document-list-page.component.css']
})
export class DocumentListPageComponent extends DocumentBasePageComponent implements OnInit, AfterViewInit {

  public dataSource = new MatTableDataSource<Document>([]);
  public displayedColumns: string[] = ['title', 'documentable_type', 'created_at', 'download'];
  public filter: string;
  public paginatedData: PaginatedDocument;
  public pagination = DEFAULT_PAGINATION;
  public sort: string;

  @ViewChild('filterInput', { static: false }) private filterInput;

  constructor(
    @Inject(Store) store: Store<any>,
    @Inject(Router) router: Router,
    @Inject(MatDialog) dialog: MatDialog,
    @Inject(ActivatedRoute) route: ActivatedRoute,
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

  ngAfterViewInit(): void {
    const typeAhead = fromEvent(this.filterInput.nativeElement, 'input')
      .pipe(
        takeWhile(() => this.active),
        map((e: any) => (e.target.value || '') as string),
        debounceTime(1000),
        map(text => text ? text.trim() : ''),
        filter(text => text.length === 0 || text.length > 2),
        switchMap((text) => {
          this.filter = text;
          return this.filterDocuments();
        }),
      );

    typeAhead.subscribe();

    super.ngAfterViewInit();
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
    const pagination = this.pagination;
    const query = { $and: [] };

    if (this.filter) {
      query.$and.push({ $or: [
        { title: { $contL: this.filter } },
        { description: { $contL: this.filter } },
        { 'author.name': { $contL: this.filter } },
      ] });
    }

    if (this.entity_type && this.entity_id) {
      query.$and.push({ documentable_id: this.entity_id });
      query.$and.push({ documentable_type: this.entity_type });
    }

    this.startLoading();

    const mediaFetch =  this.documentSErvice.fetchAllPaginated(query, pagination.pageIndex + 1, pagination.pageSize, this.sort);
    this.paginatedData = await firstValueFrom(mediaFetch).finally(() => this.finishLoading());
    this.dataSource.data = this.paginatedData.data;

    const page = this.paginatedData;

    this.dispatchMessage(`Displaying ${page.count} of ${page.total} documents on page #${page.page}.`);
  }

  public getEntityLabel(entityName: string): string {
    return entityName ? entityName.replace('Entity', ''): '';
  }

  public paginationHandler(event: PageEvent) {
    this.pagination = event;
    this.filterDocuments();
  }

  public sortHandler(event: Sort) {
    if (event.direction) {
      this.sort = `${event.active},${event.direction.toUpperCase()}`;
    } else {
      this.sort = '';
    }

    this.filterDocuments();
  }
}
