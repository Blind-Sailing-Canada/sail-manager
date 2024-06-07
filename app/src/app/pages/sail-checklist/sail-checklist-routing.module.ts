import { NgModule } from '@angular/core';
import {
  RouterModule,
  Routes,
} from '@angular/router';
import { SubRoutes } from '../../routes/routes';
import { ArrivalPageComponent } from './arrival-page/arrival-page.component';
import { DeparturePageComponent } from './departure-page/departure-page.component';
import { SailChecklistEditPageComponent } from './sail-checklist-edit-page/sail-checklist-edit-page.component';
import { SailChecklistListPageComponent } from './sail-checklist-list-page/sail-checklist-list-page.component';
import { SailChecklistViewPageComponent } from './sail-checklist-view-page/sail-checklist-view-page.component';
import { PendingChangesGuard } from '../../auth/pending-change.guard';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: SailChecklistListPageComponent,
  },
  {
    path: `${SubRoutes.VIEW_SAIL_CHECKLIST}/:sail_id`,
    component: SailChecklistViewPageComponent,
  },
  {
    path: `${SubRoutes.EDIT_SAIL_CHECKLIST}/:sail_id`,
    component: SailChecklistEditPageComponent,
    canDeactivate: [PendingChangesGuard],
  },
  {
    path: `${SubRoutes.DEPARTURE_SAIL_CHECKLIST}/:sail_id`,
    component: DeparturePageComponent,
    canDeactivate: [PendingChangesGuard],
  },
  {
    path: `${SubRoutes.ARRIVAL_SAIL_CHECKLIST}/:sail_id`,
    component: ArrivalPageComponent,
    canDeactivate: [PendingChangesGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SailChecklistRoutingModule { }
