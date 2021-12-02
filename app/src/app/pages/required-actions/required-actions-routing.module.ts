import { NgModule } from '@angular/core';
import { RequiredActionPageComponent } from './required-action-page/required-action-page.component';
import { Routes, RouterModule } from '@angular/router';
import { SubRoutes } from '../../routes/routes';

const routes: Routes = [
  {
    path: `${SubRoutes.VIEW_REQUIRED_ACTION}/:id`,
    component: RequiredActionPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RequiredActionsRoutingModule { }
