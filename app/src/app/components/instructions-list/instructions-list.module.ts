import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AngularMaterialModule } from '../../angular-material/angular-material.module';
import { PipesModule } from '../../pipes/pipes.module';
import { ImageListModule } from '../image-list/image-list.module';
import { InstructionsListComponent } from './instructions-list.component';

@NgModule({
  declarations: [
    InstructionsListComponent,
  ],
  exports: [
    InstructionsListComponent,
  ],
  imports: [
    AngularMaterialModule,
    CommonModule,
    DragDropModule,
    ImageListModule,
    PipesModule,
  ]
})
export class InstructionsListModule { }
