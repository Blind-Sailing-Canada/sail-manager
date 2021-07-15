import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AngularMaterialModule } from '../../angular-material/angular-material.module';
import { IconTextModule } from '../icon-text/icon-text.module';
import { ImageFormComponent } from './image-form.component';

@NgModule({
  declarations: [
    ImageFormComponent,
  ],
  exports: [
    ImageFormComponent,
  ],
  imports: [
    AngularMaterialModule,
    CommonModule,
    IconTextModule,
    ReactiveFormsModule,
  ]
})
export class ImageFormModule { }
