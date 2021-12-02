import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AngularMaterialModule } from '../../../angular-material/angular-material.module';
import { BoatChecklistItemInputComponent } from './boat-checklist-item-input.component';

@NgModule({
  declarations: [
    BoatChecklistItemInputComponent
  ],
  imports: [
    AngularMaterialModule,
    CommonModule,
    ReactiveFormsModule,
  ],
  exports: [
    BoatChecklistItemInputComponent
  ]
})
export class BoatChecklistItemInputModule { }
