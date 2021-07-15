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
import { SailChecklistType } from '../../../../../../api/src/types/sail-checklist/sail-checklist-type';
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
  public boatId: string = null;
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
    this.boatId = this.route.snapshot.queryParams.boatId;
    this.boatName = this.route.snapshot.queryParams.boatName;
    this.excludeSailId = this.route.snapshot.queryParams.excludeSailId;

    this.subscribeToStoreSliceWithUser(STORE_SLICES.SAILS);
    this.subscribeToStoreSliceWithUser(STORE_SLICES.CHECKLISTS);

    if (this.boatId) {
      if (this.excludeSailId) {
        const query = JSON.stringify({
          checklistType: SailChecklistType.Before,
          sailId: { $ne: this.excludeSailId },
          'sail.boatId': this.boatId,
        });
        this.dispatchAction(findSailChecklists({ query: `s=${query}&limit=10&sort=sail.start,DESC` }));
      } else {
        const query = JSON.stringify({
          'sail.boatId': this.boatId,
          checklistType: SailChecklistType.Before,
        });
        this.dispatchAction(findSailChecklists({ query: `s=${query}&limit=10&sort=sail.start,DESC` }));
      }
    } else {
      const query = JSON.stringify({
        checklistType: SailChecklistType.Before,
      });
      this.dispatchAction(findSailChecklists({ query: `s=${query}&limit=10&sort=sail.start,DESC` }));
    }
  }

  public get checklists(): SailChecklist[] {
    const ids = Object.keys(this.sailChecklists || {});
    const list: SailChecklist[] = ids
      .filter(id => id !== this.excludeSailId)
      .map(id => this.sailChecklists[id])
      .filter(checklist => this.boatId ? checklist.sail.boatId === this.boatId : true);

    return list;
  }

  public formatDate(date: Date | string): string {
    return this.momentService.format(date);
  }

}
