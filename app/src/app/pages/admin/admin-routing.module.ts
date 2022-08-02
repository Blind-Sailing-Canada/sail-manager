import { NgModule } from '@angular/core';
import {
  RouterModule,
  Routes,
} from '@angular/router';
import { AdminGuard } from '../../auth/admin.guard';
import { EditUserAccessGuard } from '../../auth/edit-user-access.guard';
import { SubRoutes } from '../../routes/routes';
import { AdminDashboardPageComponent } from './admin-dashboard-page/admin-dashboard-page.component';
import { AdminDBPageComponent } from './admin-db-page/admin-db-page.component';
import { AdminSailCategoryPageComponent } from './admin-sail-category-page/admin-sail-category-page.component';
import { AdminUserEditPageComponent } from './admin-user-edit-page/admin-user-edit-page.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AdminGuard],
    component: AdminDashboardPageComponent,
    pathMatch: 'full'
  },
  {
    path: `${SubRoutes.EDIT_PROFILE_PRIVILEGES}/:id`,
    canActivate: [EditUserAccessGuard],
    component: AdminUserEditPageComponent,
  },
  {
    path: `${SubRoutes.DB_QUERY}`,
    canActivate: [AdminGuard],
    component: AdminDBPageComponent,
  },
  {
    path: `${SubRoutes.LIST_SAIL_CATEGORIES}`,
    canActivate: [AdminGuard],
    component: AdminSailCategoryPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
