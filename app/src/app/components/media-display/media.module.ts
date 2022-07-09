import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AngularMaterialModule } from '../../angular-material/angular-material.module';
import { MediaDisplayComponent } from './media-display.component';

@NgModule({
  declarations: [
    MediaDisplayComponent,
  ],
  imports: [
    AngularMaterialModule,
    CommonModule,
  ],
  exports: [
    MediaDisplayComponent,
  ]
})
export class MediaDisplayModule { }
