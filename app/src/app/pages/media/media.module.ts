import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularMaterialModule } from '../../angular-material/angular-material.module';
import { MediaListPageComponent } from './media-list-page/media-list-page.component';
import { MediaRoutingModule } from './media-routing.module';
import { ImageListModule } from '../../components/image-list/image-list.module';

@NgModule({
  declarations: [MediaListPageComponent],
  imports: [
    AngularMaterialModule,
    CommonModule,
    ImageListModule,
    MediaRoutingModule,
  ]
})
export class MediaModule { }
