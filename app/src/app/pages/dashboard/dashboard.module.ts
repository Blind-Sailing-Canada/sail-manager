import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AngularMaterialModule } from '../../angular-material/angular-material.module';
import { FieldsetModule } from '../../components/fieldset/fieldset.module';
import { RequiredActionsListModule } from '../../components/required-actions-list/required-actions-list.module';
import { SailListModule } from '../../components/sail-list/sail-list.module';
import { BasePageModule } from '../base-page/base-page.module';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';

@NgModule({
  declarations: [DashboardComponent],
  imports: [
    AngularMaterialModule,
    BasePageModule,
    CommonModule,
    DashboardRoutingModule,
    FieldsetModule,
    RequiredActionsListModule,
    SailListModule,
  ]
})
export class DashboardModule { }
