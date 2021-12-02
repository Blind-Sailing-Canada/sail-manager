import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularMaterialModule } from '../../../angular-material/angular-material.module';
import { FieldsetModule } from '../../fieldset/fieldset.module';
import { FormSelectInputComponent } from './form-select-input.component';

@NgModule({
  declarations: [
    FormSelectInputComponent
  ],
  imports: [
    AngularMaterialModule,
    CommonModule,
    FieldsetModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [
    FormSelectInputComponent
  ]
})
export class FormSelectInputModule { }
