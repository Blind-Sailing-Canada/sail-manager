import { NgModule } from '@angular/core';
import {
  RouterModule,
  Routes,
} from '@angular/router';
import { AdminGuard } from '../../auth/admin.guard';
import { EditUserAccessGuard } from '../../auth/edit-user-access.guard';
import { SUB_ROUTES } from '../../routes/routes';
import { AdminDashboardPageComponent } from './admin-dashboard-page/admin-dashboard-page.component';
import { AdminUserEditPageComponent } from './admin-user-edit-page/admin-user-edit-page.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AdminGuard],
    component: AdminDashboardPageComponent,
  },
  {
    path: `${SUB_ROUTES.EDIT_PROFILE_PRIVILEGES}/:id`,
    canActivate: [EditUserAccessGuard],
    component: AdminUserEditPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
