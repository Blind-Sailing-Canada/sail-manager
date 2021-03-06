import { NgModule } from '@angular/core';
import {
  RouterModule,
  Routes,
} from '@angular/router';
import { CreateSailGuard } from '../../auth/create-sail.guard';
import { ViewUserSailsGuard } from '../../auth/view-user-sails.guard';
import { SubRoutes } from '../../routes/routes';
import { SailCancelPageComponent } from './sail-cancel-page/sail-cancel-page.component';
import { SailEditPageComponent } from './sail-edit-page/sail-edit-page.component';
import { SailListPageComponent } from './sail-list-page/sail-list-page.component';
import { SailListPerPersonPageComponent } from './sail-list-per-person-page/sail-list-per-person-page.component';
import { SailManifestEditPageComponent } from './sail-manifest-edit-page/sail-manifest-edit-page.component';
import { SailPicturesPageComponent } from './sail-pictures-page/sail-pictures-page.component';
import { SailViewPageComponent } from './sail-view-page/sail-view-page.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: SailListPageComponent,
  },
  {
    path: SubRoutes.CREATE_SAIL,
    canActivate: [CreateSailGuard],
    component: SailEditPageComponent,
  },
  {
    path: `${SubRoutes.CREATE_SAIL}/:sail_request_id`,
    canActivate: [CreateSailGuard],
    component: SailEditPageComponent,
  },
  {
    path: `${SubRoutes.EDIT_SAIL}/:id`,
    component: SailEditPageComponent,
  },
  {
    path: `${SubRoutes.VIEW_SAIL}/:id`,
    component: SailViewPageComponent,
  },
  {
    path: `${SubRoutes.CANCEL_SAIL}/:id`,
    component: SailCancelPageComponent,
  },
  {
    path: `${SubRoutes.EDIT_SAIL_MANIFEST}/:id`,
    component: SailManifestEditPageComponent,
  },
  {
    path: `${SubRoutes.VIEW_SAIL_PICTURES}/:id`,
    component: SailPicturesPageComponent,
  },
  {
    path: `${SubRoutes.VIEW_SAIL_PER_PERSON}/:profile_id`,
    canActivate: [ViewUserSailsGuard],
    component: SailListPerPersonPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SailRoutingModule { }
