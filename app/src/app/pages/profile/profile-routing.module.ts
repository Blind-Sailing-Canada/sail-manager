import { NgModule } from '@angular/core';
import {
  RouterModule,
  Routes,
} from '@angular/router';
import { EditProfileGuard } from '../../auth/edit-profile.guard';
import { SubRoutes } from '../../routes/routes';
import { ProfileEditPageComponent } from './profile-edit-page/profile-edit-page.component';
import { ProfileSettingsPageComponent } from './profile-settings-page/profile-settings-page.component';
import { ProfileViewPageComponent } from './profile-view-page/profile-view-page.component';

const routes: Routes = [
  {
    path: `${SubRoutes.VIEW_PROFILE}/:id`,
    component: ProfileViewPageComponent,
  },
  {
    path: `${SubRoutes.EDIT_PROFILE}/:id`,
    canActivate: [EditProfileGuard],
    component: ProfileEditPageComponent,
  },
  {
    path: `${SubRoutes.PROFILE_SETTINGS}`,
    component: ProfileSettingsPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileRoutingModule { }
