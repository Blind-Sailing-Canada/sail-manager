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

@NgModule({
  declarations: [
    AdminDashboardPageComponent,
    AdminUserEditPageComponent,
  ],
  imports: [
    AdminRoutingModule,
    AngularMaterialModule,
    BasePageModule,
    CommonModule,
    FormsModule,
    ProfileListModule,
    ReactiveFormsModule,
    TableModule,
  ]
})
export class AdminModule { }
