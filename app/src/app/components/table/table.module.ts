import { AngularMaterialModule } from '../../angular-material/angular-material.module';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TableComponent } from './table.component';

@NgModule({
  declarations: [TableComponent],
  exports: [TableComponent],
  imports: [
    AngularMaterialModule,
    CommonModule,
  ]
})
export class TableModule { }
