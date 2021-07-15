import { NgModule } from '@angular/core';
import {
  RouterModule,
  Routes,
} from '@angular/router';
import { SUB_ROUTES } from '../../routes/routes';
import { BoatInstructionsViewPageComponent } from './boat-instructions-view-page/boat-instructions-view-page.component';
import { BoatInstructionsEditPageComponent } from './boat-instructions-edit-page/boat-instructions-edit-page.component';
import { EditBoatGuard } from '../../auth/edit-boat.guard';

const routes: Routes = [
  {
    path: `${SUB_ROUTES.VIEW_BOAT_INSTRUCTIONS}/:id`,
    component: BoatInstructionsViewPageComponent,
  },
  {
    path: `${SUB_ROUTES.EDIT_BOAT_INSTRUCTIONS}/:id`,
    canActivate: [EditBoatGuard],
    component: BoatInstructionsEditPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BoatInstructionsRoutingModule { }
