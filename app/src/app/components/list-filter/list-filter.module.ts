import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AngularMaterialModule } from '../../angular-material/angular-material.module';
import { ListFilterComponent } from './list-filter.component';

@NgModule({
  declarations: [
    ListFilterComponent,
  ],
  exports: [
    ListFilterComponent,
  ],
  imports: [
    AngularMaterialModule,
    CommonModule,
  ]
})
export class ListFilterModule { }
