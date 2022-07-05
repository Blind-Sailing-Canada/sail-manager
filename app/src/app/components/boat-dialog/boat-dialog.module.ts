import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BoatDialogComponent } from './boat-dialog.component';
import { AngularMaterialModule } from '../../angular-material/angular-material.module';
import { TableModule } from '../table/table.module';
import { BoatTableModule } from '../boat-table/boat-table.module';

@NgModule({
  declarations: [
    BoatDialogComponent,
  ],
  imports: [
    AngularMaterialModule,
    BoatTableModule,
    CommonModule,
    TableModule,
  ]
})
export class BoatDialogModule { }
