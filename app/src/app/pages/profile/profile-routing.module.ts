import { NgModule } from '@angular/core';
import {
  RouterModule,
  Routes,
} from '@angular/router';
import { EditProfileGuard } from '../../auth/edit-profile.guard';
import { SUB_ROUTES } from '../../routes/routes';
import { ProfileEditPageComponent } from './profile-edit-page/profile-edit-page.component';
import { ProfileSettingsPageComponent } from './profile-settings-page/profile-settings-page.component';
import { ProfileViewPageComponent } from './profile-view-page/profile-view-page.component';

const routes: Routes = [
  {
    path: `${SUB_ROUTES.VIEW_PROFILE}/:id`,
    component: ProfileViewPageComponent,
  },
  {
    path: `${SUB_ROUTES.EDIT_PROFILE}/:id`,
    canActivate: [EditProfileGuard],
    component: ProfileEditPageComponent,
  },
  {
    path: `${SUB_ROUTES.PROFILE_SETTINGS}`,
    component: ProfileSettingsPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileRoutingModule { }
