import {
  AfterContentInit,
  AfterViewInit,
  Component,
  ContentChild,
  ContentChildren,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  ViewChild,
} from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatColumnDef, MatHeaderRowDef, MatTable, MatTableDataSource } from '@angular/material/table';
import { debounceTime, fromEvent, map, switchMap, takeWhile } from 'rxjs';
import { DEFAULT_PAGINATION } from '../../models/default-pagination';
import { FilterInfo } from '../../models/filter-into';
import { PaginatedData } from '../../models/paginated-data';
import { WindowService } from '../../services/window.service';

@Component({
  selector: 'app-material-table',
  templateUrl: './material-table.component.html',
  styleUrls: ['./material-table.component.scss']
})
export class MaterialTableComponent<T> implements OnInit, AfterViewInit, OnDestroy, AfterContentInit, OnChanges {
  @Input() public dataSource = new MatTableDataSource<T>([]);
  @Input() public defaultFilterInfo: FilterInfo;
  @Input() public displayedColumns: string[] = [];
  @Input() public loading: boolean;
  @Input() public paginatedData: PaginatedData<T>;
  @Input() public paginationLabel: string;
  @Input() public tableTitle = '';
  @Input() public searchTitle = 'Search';
  @Input() public showPaginator = true;
  @Input() public showSearchInput = true;
  @Output() public filterHandler: EventEmitter<FilterInfo> = new EventEmitter();

  @ViewChild('filterInput', { static: false }) private filterInput;

  public pagination: PageEvent = { ...DEFAULT_PAGINATION };
  public sort: string;
  public search: string;
  private active: boolean;

  @ContentChild(MatSort) sortElement: MatSort;
  @ContentChildren(MatColumnDef) columnDefs: QueryList<MatColumnDef>;
  @ContentChildren(MatHeaderRowDef) headerRowDefs: QueryList<MatHeaderRowDef>;

  @ViewChild(MatTable, { static: true }) table: MatTable<T>;

  constructor(@Inject(WindowService) public windowService: WindowService) {
  }

  ngOnChanges(): void {
    this.pagination = this.defaultFilterInfo?.pagination || { ...DEFAULT_PAGINATION };
    this.search = this.defaultFilterInfo?.search;
  }

  ngOnDestroy(): void {
    this.active = false;
  }

  ngOnInit(): void {
    this.active = true;
    this.search = this.defaultFilterInfo?.search;
    this.sort = this.defaultFilterInfo?.sort;
    this.pagination = this.defaultFilterInfo?.pagination || { ...DEFAULT_PAGINATION };
  }

  ngAfterViewInit(): void {
    if (!this.filterInput) {
      return;
    }

    const typeAhead = fromEvent(this.filterInput.nativeElement, 'input')
      .pipe(
        takeWhile(() => this.active),
        map((e: any) => (e.target.value || '') as string),
        debounceTime(1000),
        map(text => text ? text.trim() : ''),
        // filter(text => text.length === 0 || text.length > 2),
        switchMap((text) => {
          this.search = text;
          this.pagination.pageIndex = 0;
          return this.applyFilter();
        }),
      );

    typeAhead.subscribe();
  }

  ngAfterContentInit() {
    this.sortElement.sortChange.subscribe(event => {
      this.sortHandler(event);
    });
    this.columnDefs.forEach(columnDef => this.table.addColumnDef(columnDef));
    this.headerRowDefs.forEach(headerRowDef => this.table.addHeaderRowDef(headerRowDef));
  }

  public paginationHandler(event: PageEvent) {
    this.pagination = event;
    this.applyFilter();
  }

  public sortHandler(event: Sort) {
    if (event.direction) {
      this.sort = `${event.active},${event.direction.toUpperCase()}`;
    } else {
      this.sort = '';
    }

    this.applyFilter();
  }

  public async applyFilter() {
    this.filterHandler.emit({ pagination: this.pagination, sort: this.sort, search: this.search });
  }
}
