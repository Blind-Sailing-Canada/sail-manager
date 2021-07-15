import { AngularMaterialModule } from '../../angular-material/angular-material.module';
import { CommonModule } from '@angular/common';
import { MaintenanceListComponent } from './maintenance-list.component';
import { NgModule } from '@angular/core';
import { PipesModule } from '../../pipes/pipes.module';
import { TableModule } from '../table/table.module';

@NgModule({
  declarations: [
    MaintenanceListComponent,
  ],
  exports: [
    MaintenanceListComponent,
  ],
  imports: [
    AngularMaterialModule,
    CommonModule,
    PipesModule,
    TableModule,
  ]
})
export class MaintenanceListModule { }
