import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AngularMaterialModule } from '../../angular-material/angular-material.module';
import { BoatDialogModule } from '../boat-dialog/boat-dialog.module';
import { ProfileDialogModule } from '../profile-dialog/profile-dialog.module';
import { SailListComponent } from './sail-list.component';
import { PipesModule } from '../../pipes/pipes.module';
import { TableModule } from '../table/table.module';

@NgModule({
  declarations: [
    SailListComponent
  ],
  imports: [
    AngularMaterialModule,
    BoatDialogModule,
    CommonModule,
    ProfileDialogModule,
    PipesModule,
    TableModule,
  ],
  exports: [
    SailListComponent
  ]
})
export class SailListModule { }
