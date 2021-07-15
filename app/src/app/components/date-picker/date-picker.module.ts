import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AngularMaterialModule } from '../../angular-material/angular-material.module';
import { DatePickerComponent } from './date-picker.component';

@NgModule({
  declarations: [
    DatePickerComponent,
  ],
  imports: [
    AngularMaterialModule,
    CommonModule,
    ReactiveFormsModule,
  ],
  exports: [
    DatePickerComponent,
  ]
})
export class DatePickerModule { }
