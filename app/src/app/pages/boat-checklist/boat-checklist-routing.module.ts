import { NgModule } from '@angular/core';
import {
  RouterModule,
  Routes,
} from '@angular/router';
import { BoatChecklistEditPageComponent } from './boat-checklist-edit-page/boat-checklist-edit-page.component';
import { BoatChecklistListPageComponent } from './boat-checklist-list-page/boat-checklist-list-page.component';
import { BoatChecklistViewPageComponent } from './boat-checklist-view-page/boat-checklist-view-page.component';
import { SubRoutes } from '../../routes/routes';
import { EditBoatGuard } from '../../auth/edit-boat.guard';
import { CreateBoatGuard } from '../../auth/create-boat.guard';

const routes: Routes = [
  {
    path: '',
    component: BoatChecklistListPageComponent,
  },
  {
    path: SubRoutes.CREATE_BOAT_CHECKLIST,
    canActivate: [CreateBoatGuard],
    component: BoatChecklistEditPageComponent,
  },
  {
    path: `${SubRoutes.EDIT_BOAT_CHECKLIST}/:id`,
    canActivate: [EditBoatGuard],
    component: BoatChecklistEditPageComponent,
  },
  {
    path: `${SubRoutes.VIEW_BOAT}/:id`,
    component: BoatChecklistViewPageComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BoatChecklistRoutingModule { }
