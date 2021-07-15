import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FieldsetComponent } from './fieldset.component';

@NgModule({
  declarations: [
    FieldsetComponent,
  ],
  exports: [
    FieldsetComponent,
  ],
  imports: [
    CommonModule,
  ]
})
export class FieldsetModule { }
