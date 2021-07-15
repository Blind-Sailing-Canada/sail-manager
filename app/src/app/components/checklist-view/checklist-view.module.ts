import { AngularMaterialModule } from '../../angular-material/angular-material.module';
import { ChecklistViewComponent } from './checklist-view.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [
    ChecklistViewComponent,
  ],
  exports: [
    ChecklistViewComponent,
  ],
  imports: [
    AngularMaterialModule,
    CommonModule,
  ]
})
export class ChecklistViewModule { }
