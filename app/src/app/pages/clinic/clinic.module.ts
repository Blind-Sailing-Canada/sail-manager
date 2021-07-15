import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { AngularMaterialModule } from '../../angular-material/angular-material.module';
import { IconTextModule } from '../../components/icon-text/icon-text.module';
import { ListFilterModule } from '../../components/list-filter/list-filter.module';
import { ProfileBulletModule } from '../../components/profile-bullet/profile-bullet.module';
import { TableModule } from '../../components/table/table.module';
import { ClinicEditPageComponent } from './clinic-edit-page/clinic-edit-page.component';
import { ClinicListPageComponent } from './clinic-list-page/clinic-list-page.component';
import { ClinicRoutingModule } from './clinic-routing.module';
import { ClinicViewPageComponent } from './clinic-view-page/clinic-view-page.component';

@NgModule({
  declarations: [
    ClinicEditPageComponent,
    ClinicListPageComponent,
    ClinicViewPageComponent,
  ],
  imports: [
    AngularMaterialModule,
    ClinicRoutingModule,
    CommonModule,
    FormsModule,
    IconTextModule,
    ListFilterModule,
    ProfileBulletModule,
    ReactiveFormsModule,
    TableModule,
  ]
})
export class ClinicModule { }
