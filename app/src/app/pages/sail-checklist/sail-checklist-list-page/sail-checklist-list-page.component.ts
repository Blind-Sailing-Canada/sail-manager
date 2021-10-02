import {
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import {
  ActivatedRoute,
  Router,
} from '@angular/router';
import { Store } from '@ngrx/store';
import { SailChecklist } from '../../../../../../api/src/types/sail-checklist/sail-checklist';
import { MomentService } from '../../../services/moment.service';
import { findSailChecklists } from '../../../store/actions/sail-checklist.actions';
import { STORE_SLICES } from '../../../store/store';
import { BasePageComponent } from '../../base-page/base-page.component';

@Component({
  selector: 'app-sail-checklist-list-page',
  templateUrl: './sail-checklist-list-page.component.html',
  styleUrls: ['./sail-checklist-list-page.component.css']
})
export class SailChecklistListPageComponent extends BasePageComponent implements OnInit {

  public checklistIds: string[] = [];
  public boat_id: string = null;
  public boatName: string = null;
  public excludeSailId: string = null;

  constructor(
    @Inject(Store) store: Store<any>,
    @Inject(ActivatedRoute) route: ActivatedRoute,
    @Inject(Router) router: Router,
    @Inject(MomentService) private momentService: MomentService,
  ) {
    super(store, route, router);
  }

  ngOnInit() {
    this.checklistIds = this.route.snapshot.queryParams.checklistIds;
    this.boat_id = this.route.snapshot.queryParams.boat_id;
    this.boatName = this.route.snapshot.queryParams.boatName;
    this.excludeSailId = this.route.snapshot.queryParams.excludeSailId;

    this.subscribeToStoreSliceWithUser(STORE_SLICES.SAILS);
    this.subscribeToStoreSliceWithUser(STORE_SLICES.CHECKLISTS);

    if (this.boat_id) {
      if (this.excludeSailId) {
        this.dispatchAction(findSailChecklists({ query: `boat_id=${this.boat_id}&exclude_sail_id=${this.excludeSailId}` }));
      } else {
        this.dispatchAction(findSailChecklists({ query: `boat_id=${this.boat_id}` }));
      }
    } else {
      this.dispatchAction(findSailChecklists({ query: '' }));
    }
  }

  public get checklists(): SailChecklist[] {
    const ids = Object.keys(this.sailChecklists || {});
    const list: SailChecklist[] = ids
      .filter(id => id !== this.excludeSailId)
      .map(id => this.sailChecklists[id])
      .filter(checklist => this.boat_id ? checklist.sail.boat_id === this.boat_id : true);

    return list;
  }

  public formatDate(date: Date | string): string {
    return this.momentService.format(date);
  }

}
