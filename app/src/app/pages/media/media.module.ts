import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularMaterialModule } from '../../angular-material/angular-material.module';
import { MediaListPageComponent } from './media-list-page/media-list-page.component';
import { MediaRoutingModule } from './media-routing.module';
import { ImageListModule } from '../../components/image-list/image-list.module';
import { PipesModule } from '../../pipes/pipes.module';
import { FormsModule } from '@angular/forms';
import { MaterialTableModule } from '../../components/material-table/material-table.module';
import { ProfileBulletModule } from '../../components/profile-bullet/profile-bullet.module';

@NgModule({
  declarations: [MediaListPageComponent],
  imports: [
    AngularMaterialModule,
    CommonModule,
    FormsModule,
    ImageListModule,
    MediaRoutingModule,
    MaterialTableModule,
    PipesModule,
    ProfileBulletModule,
  ]
})
export class MediaModule { }
