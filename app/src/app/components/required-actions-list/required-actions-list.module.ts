import { AngularMaterialModule } from '../../angular-material/angular-material.module';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RequiredActionsListComponent } from './required-actions-list.component';

@NgModule({
  declarations: [
    RequiredActionsListComponent,
  ],
  exports: [
    RequiredActionsListComponent,
  ],
  imports: [
    AngularMaterialModule,
    CommonModule
  ]
})
export class RequiredActionsListModule { }
