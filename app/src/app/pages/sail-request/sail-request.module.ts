import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { AngularMaterialModule } from '../../angular-material/angular-material.module';
import { ProfileBulletModule } from '../../components/profile-bullet/profile-bullet.module';
import { SailRequestListModule } from '../../components/sail-request-list/sail-request-list.module';
import { TableModule } from '../../components/table/table.module';
import { PipesModule } from '../../pipes/pipes.module';
import { BasePageModule } from '../base-page/base-page.module';
import { SailRequestBasePageComponent } from './sail-request-base-page/sail-request-base-page.component';
import { SailRequestEditPageComponent } from './sail-request-edit-page/sail-request-edit-page.component';
import { SailRequestListPageComponent } from './sail-request-list-page/sail-request-list-page.component';
import { SailRequestRoutingModule } from './sail-request-routing.module';
import { SailRequestViewPageComponent } from './sail-request-view-page/sail-request-view-page.component';

@NgModule({
  declarations: [
    SailRequestBasePageComponent,
    SailRequestListPageComponent,
    SailRequestViewPageComponent,
    SailRequestEditPageComponent,
  ],
  imports: [
    AngularMaterialModule,
    BasePageModule,
    CommonModule,
    FormsModule,
    PipesModule,
    ProfileBulletModule,
    ReactiveFormsModule,
    SailRequestListModule,
    SailRequestRoutingModule,
    TableModule,
  ]
})
export class SailRequestModule { }
