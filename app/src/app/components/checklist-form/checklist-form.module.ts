import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { AngularMaterialModule } from '../../angular-material/angular-material.module';
import { ChecklistFormComponent } from './checklist-form.component';

@NgModule({
  declarations: [
    ChecklistFormComponent,
  ],
  exports: [
    ChecklistFormComponent,
  ],
  imports: [
    AngularMaterialModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class ChecklistFormModule { }
