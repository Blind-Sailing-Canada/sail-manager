import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemPickerComponent } from './item-picker.component';
import { AngularMaterialModule } from '../../angular-material/angular-material.module';

@NgModule({
  declarations: [
    ItemPickerComponent,
  ],
  imports: [
    AngularMaterialModule,
    CommonModule,
  ],
  exports: [
    ItemPickerComponent,
  ],
})
export class ItemPickerModule { }
