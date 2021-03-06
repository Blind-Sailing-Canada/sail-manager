import { NgModule } from '@angular/core';
import {
  RouterModule,
  Routes,
} from '@angular/router';
import { SubRoutes } from '../../routes/routes';
import { SailRequestEditPageComponent } from './sail-request-edit-page/sail-request-edit-page.component';
import { SailRequestListPageComponent } from './sail-request-list-page/sail-request-list-page.component';
import { SailRequestViewPageComponent } from './sail-request-view-page/sail-request-view-page.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: SailRequestListPageComponent,
  },
  {
    path: SubRoutes.CREATE_SAIL_REQUEST,
    component: SailRequestEditPageComponent,
  },
  {
    path: `${SubRoutes.EDIT_SAIL_REQUEST}/:id`,
    component: SailRequestEditPageComponent,
  },
  {
    path: `${SubRoutes.VIEW_SAIL_REQUEST}/:id`,
    component: SailRequestViewPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SailRequestRoutingModule { }
