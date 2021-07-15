import { NgModule } from '@angular/core';
import {
  RouterModule,
  Routes,
} from '@angular/router';
import { BoatEditPageComponent } from './boat-edit-page/boat-edit-page.component';
import { BoatListPageComponent } from './boat-list-page/boat-list-page.component';
import { BoatViewPageComponent } from './boat-view-page/boat-view-page.component';
import { SUB_ROUTES } from '../../routes/routes';
import { EditBoatGuard } from '../../auth/edit-boat.guard';
import { CreateBoatGuard } from '../../auth/create-boat.guard';

const routes: Routes = [
  {
    path: '',
    component: BoatListPageComponent,
  },
  {
    path: SUB_ROUTES.CREATE_BOAT,
    canActivate: [CreateBoatGuard],
    component: BoatEditPageComponent,
  },
  {
    path: `${SUB_ROUTES.EDIT_BOAT}/:id`,
    canActivate: [EditBoatGuard],
    component: BoatEditPageComponent,
  },
  {
    path: `${SUB_ROUTES.VIEW_BOAT}/:id`,
    component: BoatViewPageComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BoatRoutingModule { }
