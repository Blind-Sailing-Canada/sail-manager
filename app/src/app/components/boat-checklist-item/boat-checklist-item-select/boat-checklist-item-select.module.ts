import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularMaterialModule } from '../../../angular-material/angular-material.module';
import { FieldsetModule } from '../../fieldset/fieldset.module';
import { BoatChecklistItemSelectComponent } from './boat-checklist-item-select.component';

@NgModule({
  declarations: [
    BoatChecklistItemSelectComponent
  ],
  imports: [
    AngularMaterialModule,
    CommonModule,
    FieldsetModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [
    BoatChecklistItemSelectComponent
  ]
})
export class BoatChecklistItemSelectModule { }
