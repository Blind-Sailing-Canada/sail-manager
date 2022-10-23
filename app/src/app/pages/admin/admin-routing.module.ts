import { NgModule } from '@angular/core';
import {
  RouterModule,
  Routes,
} from '@angular/router';
import { AdminGuard } from '../../auth/admin.guard';
import { EditUserAccessGuard } from '../../auth/edit-user-access.guard';
import { SubRoutes } from '../../routes/routes';
import { AdminDashboardPageComponent } from './admin-dashboard-page/admin-dashboard-page.component';
import { AdminSailCategoryPageComponent } from './admin-sail-category-page/admin-sail-category-page.component';
import { AdminUserEditPageComponent } from './admin-user-edit-page/admin-user-edit-page.component';
import { SavedQueryEditPageComponent } from './saved-query/saved-query-edit-page/saved-query-edit-page.component';
import { SavedQueryListPageComponent } from './saved-query/saved-query-list-page/saved-query-list-page.component';

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
    path: `${SubRoutes.LIST_SAIL_CATEGORIES}`,
    canActivate: [AdminGuard],
    component: AdminSailCategoryPageComponent,
  },
  {
    path: `${SubRoutes.SAVED_QUERY}`,
    canActivate: [AdminGuard],
    component: SavedQueryListPageComponent,
  },
  {
    path: `${SubRoutes.SAVED_QUERY}/${SubRoutes.LIST_SAVED_QUERY}`,
    canActivate: [AdminGuard],
    component: SavedQueryListPageComponent,
  },
  {
    path: `${SubRoutes.SAVED_QUERY}/${SubRoutes.CREATE_SAVED_QUERY}`,
    canActivate: [AdminGuard],
    component: SavedQueryEditPageComponent,
  },
  {
    path: `${SubRoutes.SAVED_QUERY}/${SubRoutes.VIEW_SAVED_QUERY}/:id`,
    canActivate: [AdminGuard],
    component: SavedQueryEditPageComponent,
  },
  {
    path: `${SubRoutes.SAVED_QUERY}/${SubRoutes.EDIT_SAVED_QUERY}/:id`,
    canActivate: [AdminGuard],
    component: SavedQueryEditPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
