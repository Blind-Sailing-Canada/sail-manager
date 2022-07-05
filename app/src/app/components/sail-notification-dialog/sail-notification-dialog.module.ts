import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularMaterialModule } from '../../angular-material/angular-material.module';
import { SailNotificationDialogComponent } from './sail-notification-dialog.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    SailNotificationDialogComponent,
  ],
  imports: [
    AngularMaterialModule,
    CommonModule,
    ReactiveFormsModule,
  ]
})
export class SailNotificationDialogModule { }
