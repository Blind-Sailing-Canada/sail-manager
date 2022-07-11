import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AngularMaterialModule } from '../../angular-material/angular-material.module';
import { MaterialTableComponent } from './material-table.component';

@NgModule({
  declarations: [
    MaterialTableComponent,
  ],
  imports: [
    AngularMaterialModule,
    CommonModule,
  ],
  exports: [
    MaterialTableComponent,
  ]
})
export class MaterialTableModule { }
