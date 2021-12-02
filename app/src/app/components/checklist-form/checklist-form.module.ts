import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { AngularMaterialModule } from '../../angular-material/angular-material.module';
import { FormSelectInputModule } from '../form/form-select-input/form-select-input.module';
import { FormTextInputModule } from '../form/form-text-input/form-text-input.module';
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
    FormSelectInputModule,
    FormTextInputModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class ChecklistFormModule { }
