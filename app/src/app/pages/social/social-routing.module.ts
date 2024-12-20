import { NgModule } from '@angular/core';
import {
  RouterModule,
  Routes,
} from '@angular/router';
import { SubRoutes } from '../../routes/routes';
import { SocialCancelPageComponent } from './social-cancel-page/social-cancel-page.component';
import { SocialEditPageComponent } from './social-edit-page/social-edit-page.component';
import { SocialListPageComponent } from './social-list-page/social-list-page.component';
import { SocialManifestEditPageComponent } from './social-manifest-edit-page/social-manifest-edit-page.component';
import { SocialPicturesPageComponent } from './social-pictures-page/social-pictures-page.component';
import { SocialViewPageComponent } from './social-view-page/social-view-page.component';
import { SocialCreateManyPageComponent } from './social-create-many-page/social-create-many-page.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: SocialListPageComponent,
  },
  {
    path: SubRoutes.LIST_SOCIALS,
    component: SocialListPageComponent,
  },
  {
    path: `${SubRoutes.EDIT_SOCIAL}/:id`,
    component: SocialEditPageComponent,
  },
  {
    path: SubRoutes.CREATE_SOCIAL,
    component: SocialEditPageComponent,
  },
  {
    path: `${SubRoutes.CREATE_SOCIALS}`,
    component: SocialCreateManyPageComponent,
  },
  {
    path: `${SubRoutes.VIEW_SOCIAL}/:id`,
    component: SocialViewPageComponent,
  },
  {
    path: `${SubRoutes.VIEW_SOCIAL_PICTURES}/:id`,
    component: SocialPicturesPageComponent,
  },
  {
    path: `${SubRoutes.EDIT_SOCIAL_MANIFEST}/:id`,
    component: SocialManifestEditPageComponent,
  },
  {
    path: `${SubRoutes.CANCEL_SOCIAL}/:id`,
    component: SocialCancelPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SocialRoutingModule { }
