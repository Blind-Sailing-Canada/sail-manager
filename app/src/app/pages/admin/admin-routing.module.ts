import { NgModule } from '@angular/core';
import {
  RouterModule,
  Routes,
} from '@angular/router';
import { AdminGuard } from '../../auth/admin.guard';
import { EditUserAccessGuard } from '../../auth/edit-user-access.guard';
import { RootRoutes, SubRoutes } from '../../routes/routes';
import { AdminDashboardPageComponent } from './admin-dashboard-page/admin-dashboard-page.component';
import {
  AdminMissingSailPaymentsPageComponent,
} from './admin-payment/admin-missing-sail-payments-page/admin-missing-sail-payments-page.component';
import { AdminPaymentDashboardPageComponent } from './admin-payment/admin-payment-dashboard-page/admin-payment-dashboard-page.component';
import { AdminPaymentEditPageComponent } from './admin-payment/admin-payment-edit-page/admin-payment-edit-page.component';
import { AdminPaymentManualPageComponent } from './admin-payment/admin-payment-manual-page/admin-payment-manual-page.component';
import { AdminPaymentViewPageComponent } from './admin-payment/admin-payment-view-page/admin-payment-view-page.component';
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
    path: `${SubRoutes.ADMIN_PAYMENT_DASHBOARD}`,
    canActivate: [AdminGuard],
    component: AdminPaymentDashboardPageComponent,
  },
  {
    path: `${RootRoutes.PURCHASES}/${SubRoutes.CREATE_PURCHASE}`,
    canActivate: [AdminGuard],
    component: AdminPaymentManualPageComponent,
  },
  {
    path: `${SubRoutes.EDIT_ADMIN_PAYMENT}/:id`,
    canActivate: [AdminGuard],
    component: AdminPaymentEditPageComponent,
  },
  {
    path: `${SubRoutes.ADMIN_PAYMENT_DASHBOARD}/${SubRoutes.MISSING_SAIL_PAYMENTS}`,
    canActivate: [AdminGuard],
    component: AdminMissingSailPaymentsPageComponent,
  },
  {
    path: `${SubRoutes.VIEW_ADMIN_PAYMENT}/:id`,
    canActivate: [AdminGuard],
    component: AdminPaymentViewPageComponent,
  },
  {
    path: `${SubRoutes.EDIT_PROFILE_PRIVILEGES}/:id`,
    canActivate: [EditUserAccessGuard],
    component: AdminUserEditPageComponent,
  },
  {
    path: `${RootRoutes.SAIL_CATEGORIES}/${SubRoutes.LIST_SAIL_CATEGORIES}`,
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
