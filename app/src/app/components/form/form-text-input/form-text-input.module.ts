import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularMaterialModule } from '../../../angular-material/angular-material.module';
import { FieldsetModule } from '../../fieldset/fieldset.module';
import { FormTextInputComponent } from './form-text-input.component';

@NgModule({
  declarations: [
    FormTextInputComponent
  ],
  imports: [
    AngularMaterialModule,
    CommonModule,
    FieldsetModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [
    FormTextInputComponent
  ]
})
export class FormTextInputModule { }
