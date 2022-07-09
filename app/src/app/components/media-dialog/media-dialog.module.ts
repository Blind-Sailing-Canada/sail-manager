import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MediaDialogComponent } from './media-dialog.component';
import { AngularMaterialModule } from '../../angular-material/angular-material.module';
import { MediaDisplayModule } from '../media-display/media.module';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    MediaDialogComponent,
  ],
  imports: [
    AngularMaterialModule,
    CommonModule,
    MediaDisplayModule,
    PipesModule
  ]
})
export class MediaDialogModule { }
