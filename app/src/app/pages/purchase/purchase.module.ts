import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularMaterialModule } from '../../angular-material/angular-material.module';
import { FileSelectModule } from '../../components/file-select/file-select.module';
import { LinkAccountsDialogModule } from '../../components/link-accounts-dialog/link-accounts-dialog.module';
import { MaterialTableModule } from '../../components/material-table/material-table.module';
import { ProfileBulletModule } from '../../components/profile-bullet/profile-bullet.module';
import { TableModule } from '../../components/table/table.module';
import { UserProfileModule } from '../../components/user-profile/user-profile.module';
import { PipesModule } from '../../pipes/pipes.module';
import { BasePageModule } from '../base-page/base-page.module';
import { PurchaseListPageComponent } from './purchase-list-page/purchase-list-page.component';
import { PurchaseOutstandingPageComponent } from './purchase-outstanding-page/purchase-outstanding-page.component';
import { PurchaseRoutingModule } from './purchase-routing.module';
import { PurchaseViewPageComponent } from './purchase-view-page/purchase-view-page.component';

@NgModule({
  declarations: [
    PurchaseListPageComponent,
    PurchaseViewPageComponent,
    PurchaseOutstandingPageComponent,
  ],
  imports: [
    AngularMaterialModule,
    BasePageModule,
    CommonModule,
    FileSelectModule,
    FormsModule,
    LinkAccountsDialogModule,
    MaterialTableModule,
    PipesModule,
    ProfileBulletModule,
    PurchaseRoutingModule,
    ReactiveFormsModule,
    TableModule,
    UserProfileModule,
  ]
})
export class PurchaseModule { }
