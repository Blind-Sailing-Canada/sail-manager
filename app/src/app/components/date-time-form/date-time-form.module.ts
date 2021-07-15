import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AngularMaterialModule } from '../../angular-material/angular-material.module';
import { DateTimeFormComponent } from './date-time-form.component';

@NgModule({
  declarations: [
    DateTimeFormComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AngularMaterialModule,
  ],
  exports: [
    DateTimeFormComponent,
  ]
})
export class DateTimeFormModule { }
