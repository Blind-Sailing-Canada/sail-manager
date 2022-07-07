import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularMaterialModule } from '../../angular-material/angular-material.module';
import { SocialNotificationDialogComponent } from './social-notification-dialog.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    SocialNotificationDialogComponent,
  ],
  imports: [
    AngularMaterialModule,
    CommonModule,
    ReactiveFormsModule,
  ]
})
export class SocialNotificationDialogModule { }
