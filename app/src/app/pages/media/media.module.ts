import { AngularMaterialModule } from '../../angular-material/angular-material.module';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ImageFormModule } from '../../components/image-form/image-form.module';
import { ImageListModule } from '../../components/image-list/image-list.module';
import { MaterialTableModule } from '../../components/material-table/material-table.module';
import { MediaEditPageComponent } from './media-edit-page/media-edit-page.component';
import { MediaListPageComponent } from './media-list-page/media-list-page.component';
import { MediaRoutingModule } from './media-routing.module';
import { NgModule } from '@angular/core';
import { PipesModule } from '../../pipes/pipes.module';
import { ProfileBulletModule } from '../../components/profile-bullet/profile-bullet.module';
import { FindUserDialogModule } from '../../components/find-user-dialog/find-user-dialog.module';

@NgModule({
  declarations: [
    MediaListPageComponent,
    MediaEditPageComponent,
  ],
  imports: [
    AngularMaterialModule,
    CommonModule,
    FindUserDialogModule,
    FormsModule,
    ImageFormModule,
    ImageListModule,
    MaterialTableModule,
    MediaRoutingModule,
    PipesModule,
    ProfileBulletModule,
  ]
})
export class MediaModule { }
