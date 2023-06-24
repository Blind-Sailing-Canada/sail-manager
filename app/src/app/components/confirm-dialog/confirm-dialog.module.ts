import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularMaterialModule } from '../../angular-material/angular-material.module';
import { FormsModule } from '@angular/forms';
import { ConfirmDialogComponent } from './confirm-dialog.component';

@NgModule({
  declarations: [
    ConfirmDialogComponent,
  ],
  imports: [
    AngularMaterialModule,
    CommonModule,
    FormsModule,
  ]
})
export class ConfirmDialogModule { }
