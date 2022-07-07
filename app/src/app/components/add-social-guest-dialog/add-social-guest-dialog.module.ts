import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularMaterialModule } from '../../angular-material/angular-material.module';
import { FormsModule } from '@angular/forms';
import { AddSocialGuestDialogComponent } from './add-social-guest-dialog.component';

@NgModule({
  declarations: [
    AddSocialGuestDialogComponent,
  ],
  imports: [
    AngularMaterialModule,
    CommonModule,
    FormsModule,
  ]
})
export class AddSocialGuestDialogModule { }
