import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AngularMaterialModule } from '../../angular-material/angular-material.module';
import { FileSelectModule } from '../file-select/file-select.module';
import { ImageFormModule } from '../image-form/image-form.module';
import { InstructionsFormComponent } from './instructions-form.component';

@NgModule({
  declarations: [
    InstructionsFormComponent,
  ],
  exports: [
    InstructionsFormComponent,
  ],
  imports: [
    AngularMaterialModule,
    CommonModule,
    FileSelectModule,
    ImageFormModule,
    ReactiveFormsModule,
  ]
})
export class InstructionsFormModule { }
