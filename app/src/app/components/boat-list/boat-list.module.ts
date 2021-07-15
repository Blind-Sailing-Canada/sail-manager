import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AngularMaterialModule } from '../../angular-material/angular-material.module';
import { TableModule } from '../table/table.module';
import { BoatListComponent } from './boat-list.component';

@NgModule({
  declarations: [
    BoatListComponent
  ],
  imports: [
    AngularMaterialModule,
    CommonModule,
    TableModule,
  ],
  exports: [
    BoatListComponent
  ]
})
export class BoatListModule { }
