import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AngularMaterialModule } from '../../angular-material/angular-material.module';
import { ProfileListModule } from '../../components/profile-list/profile-list.module';
import { TableModule } from '../../components/table/table.module';
import { AdminDashboardPageComponent } from './admin-dashboard-page/admin-dashboard-page.component';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminUserEditPageComponent } from './admin-user-edit-page/admin-user-edit-page.component';
import { BasePageModule } from '../base-page/base-page.module';
import { CreateUserDialogModule } from '../../components/create-user-dialog/create-user-dialog.module';
import { AdminSailCategoryPageComponent } from './admin-sail-category-page/admin-sail-category-page.component';
import { MaterialTableModule } from '../../components/material-table/material-table.module';
import { PipesModule } from '../../pipes/pipes.module';
import { SavedQueryEditPageComponent } from './saved-query/saved-query-edit-page/saved-query-edit-page.component';
import { SavedQueryListPageComponent } from './saved-query/saved-query-list-page/saved-query-list-page.component';
import { AdminPaymentDashboardPageComponent } from './admin-payment/admin-payment-dashboard-page/admin-payment-dashboard-page.component';
import { AdminPaymentViewPageComponent } from './admin-payment/admin-payment-view-page/admin-payment-view-page.component';
import { FindUserDialogModule } from '../../components/find-user-dialog/find-user-dialog.module';
import { ProfileBulletModule } from '../../components/profile-bullet/profile-bullet.module';
import { AdminPaymentManualPageComponent } from './admin-payment/admin-payment-manual-page/admin-payment-manual-page.component';
import {
  AdminMissingSailPaymentsPageComponent,
} from './admin-payment/admin-missing-sail-payments-page/admin-missing-sail-payments-page.component';
import { AdminPaymentEditPageComponent } from './admin-payment/admin-payment-edit-page/admin-payment-edit-page.component';

@NgModule({
  declarations: [
    AdminDashboardPageComponent,
    AdminMissingSailPaymentsPageComponent,
    AdminPaymentDashboardPageComponent,
    AdminPaymentEditPageComponent,
    AdminPaymentManualPageComponent,
    AdminPaymentViewPageComponent,
    AdminSailCategoryPageComponent,
    AdminUserEditPageComponent,
    SavedQueryEditPageComponent,
    SavedQueryListPageComponent,
  ],
  imports: [
    AdminRoutingModule,
    AngularMaterialModule,
    BasePageModule,
    CommonModule,
    CreateUserDialogModule,
    FindUserDialogModule,
    FormsModule,
    MaterialTableModule,
    PipesModule,
    ProfileBulletModule,
    ProfileListModule,
    ReactiveFormsModule,
    TableModule,
  ]
})
export class AdminModule { }
