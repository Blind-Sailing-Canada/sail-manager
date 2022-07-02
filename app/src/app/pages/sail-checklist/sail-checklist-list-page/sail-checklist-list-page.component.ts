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
import { SailChecklist } from '../../../../../../api/src/types/sail-checklist/sail-checklist';
import { SailChecklistType } from '../../../../../../api/src/types/sail-checklist/sail-checklist-type';
import { Sail } from '../../../../../../api/src/types/sail/sail';
import { MomentService } from '../../../services/moment.service';
import { findSailChecklists } from '../../../store/actions/sail-checklist.actions';
import { STORE_SLICES } from '../../../store/store';
import { BasePageComponent } from '../../base-page/base-page.component';

interface SailChecklists {
  sail: Sail;
  beforeChecklist: SailChecklist;
  afterChecklist: SailChecklist;
}

interface SailChecklistsMap {
  [sailId: string]: SailChecklists;
}

@Component({
  selector: 'app-sail-checklist-list-page',
  templateUrl: './sail-checklist-list-page.component.html',
  styleUrls: ['./sail-checklist-list-page.component.css']
})
export class SailChecklistListPageComponent extends BasePageComponent implements OnInit {

  public boatName: string = null;
  public boat_id: string = null;
  public checklistIds: string[] = [];
  public checklists: SailChecklists[];
  public excludeSailId: string = null;

  constructor(
    @Inject(Store) store: Store<any>,
    @Inject(MatDialog) dialog: MatDialog,
    @Inject(ActivatedRoute) route: ActivatedRoute,
    @Inject(Router) router: Router,
    @Inject(MomentService) private momentService: MomentService,
  ) {
    super(store, route, router, dialog);
  }

  ngOnInit() {
    this.checklistIds = this.route.snapshot.queryParams.checklistIds;
    this.boat_id = this.route.snapshot.queryParams.boat_id;
    this.boatName = this.route.snapshot.queryParams.boatName;
    this.excludeSailId = this.route.snapshot.queryParams.excludeSailId;

    this.subscribeToStoreSliceWithUser(STORE_SLICES.CHECKLISTS, ({ all: sailChecklists }) => {
      const ids = Object.keys(sailChecklists || {});
      const checklistsMap = ids
      .map(id => this.sailChecklists[id])
      .filter(checklist => checklist.sail_id !== this.excludeSailId)
      .filter(checklist => this.boat_id ? checklist.sail.boat_id === this.boat_id : true)
      .reduce((red, checklist) => {
        if (!red[checklist.sail_id]) {
          red[checklist.sail_id] = {
            sail: checklist.sail,
            afterChecklist: null,
            beforeChecklist: null
          };
        }

        if (checklist.checklist_type === SailChecklistType.Before) {
          red[checklist.sail_id].beforeChecklist = checklist;
        } else if (checklist.checklist_type === SailChecklistType.After) {
          red[checklist.sail_id].afterChecklist = checklist;
        }

        return red;
      }, {} as SailChecklistsMap);

      this.checklists = Object.values(checklistsMap);
    });

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

  public formatDate(date: Date | string): string {
    return this.momentService.humanizeDateWithTime(date, true);
  }

}
