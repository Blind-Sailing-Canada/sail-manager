import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { AngularMaterialModule } from '../../angular-material/angular-material.module';
import { DocumentEditPageComponent } from './document-edit-page/document-edit-page.component';
import { DocumentListPageComponent } from './document-list-page/document-list-page.component';
import { DocumentRoutingModule } from './document-routing.module';
import { DocumentViewPageComponent } from './document-view-page/document-view-page.component';
import { FileSelectModule } from '../../components/file-select/file-select.module';
import { IconTextModule } from '../../components/icon-text/icon-text.module';
import { ListFilterModule } from '../../components/list-filter/list-filter.module';
import { PipesModule } from '../../pipes/pipes.module';
import { ProfileBulletModule } from '../../components/profile-bullet/profile-bullet.module';
import { ProfileDialogModule } from '../../components/profile-dialog/profile-dialog.module';
import { TableModule } from '../../components/table/table.module';
import { DocumentBasePageComponent } from './document-base-page/document-base-page';

@NgModule({
  declarations: [
    DocumentBasePageComponent,
    DocumentEditPageComponent,
    DocumentListPageComponent,
    DocumentViewPageComponent,
  ],
  imports: [
    AngularMaterialModule,
    CommonModule,
    DocumentRoutingModule,
    FileSelectModule,
    FormsModule,
    IconTextModule,
    ListFilterModule,
    PipesModule,
    ProfileBulletModule,
    ProfileDialogModule,
    ReactiveFormsModule,
    TableModule,
  ]
})
export class DocumentModule { }
