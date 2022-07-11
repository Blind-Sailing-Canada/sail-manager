import { NgxFilesizeModule } from 'ngx-filesize';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularMaterialModule } from '../../angular-material/angular-material.module';
import { BoatDialogModule } from '../../components/boat-dialog/boat-dialog.module';
import { CommentListModule } from '../../components/comment-list/comment-list.module';
import { FileSelectModule } from '../../components/file-select/file-select.module';
import { ImageFormModule } from '../../components/image-form/image-form.module';
import { ImageListModule } from '../../components/image-list/image-list.module';
import { MaintenanceListModule } from '../../components/maintenance-list/maintenance-list.module';
import { ProfileBulletModule } from '../../components/profile-bullet/profile-bullet.module';
import { ProfileDialogModule } from '../../components/profile-dialog/profile-dialog.module';
import { TableModule } from '../../components/table/table.module';
import { PipesModule } from '../../pipes/pipes.module';
import { BasePageModule } from '../base-page/base-page.module';
import { MaintenanceEditPageComponent } from './maintenance-edit-page/maintenance-edit-page.component';
import { MaintenanceListPageComponent } from './maintenance-list-page/maintenance-list-page.component';
import { MaintenanceResolvePageComponent } from './maintenance-resolve-page/maintenance-resolve-page.component';
import { MaintenanceRoutingModule } from './maintenance-routing.module';
import { MaintenanceViewPageComponent } from './maintenance-view-page/maintenance-view-page.component';
import { NewCommentFormModule } from '../../components/new-comment-form/new-comment-form.module';
import { MaterialTableModule } from '../../components/material-table/material-table.module';

@NgModule({
  declarations: [
    MaintenanceEditPageComponent,
    MaintenanceListPageComponent,
    MaintenanceViewPageComponent,
    MaintenanceResolvePageComponent,
  ],
  imports: [
    AngularMaterialModule,
    BasePageModule,
    BoatDialogModule,
    CommentListModule,
    CommonModule,
    FileSelectModule,
    FormsModule,
    ImageFormModule,
    ImageListModule,
    MaintenanceListModule,
    MaintenanceRoutingModule,
    MaterialTableModule,
    NewCommentFormModule,
    NgxFilesizeModule,
    PipesModule,
    ProfileBulletModule,
    ProfileDialogModule,
    ReactiveFormsModule,
    TableModule,
  ]
})
export class MaintenanceModule { }
