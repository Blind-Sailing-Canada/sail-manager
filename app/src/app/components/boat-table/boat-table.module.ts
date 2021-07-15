import { BoatTableComponent } from './boat-table.component';
import { CommonModule } from '@angular/common';
import { ImageListModule } from '../image-list/image-list.module';
import { NgModule } from '@angular/core';
import { TableModule } from '../table/table.module';

@NgModule({
  declarations: [
    BoatTableComponent,
  ],
  exports: [
    BoatTableComponent,
  ],
  imports: [
    CommonModule,
    ImageListModule,
    TableModule,
  ]
})
export class BoatTableModule { }
