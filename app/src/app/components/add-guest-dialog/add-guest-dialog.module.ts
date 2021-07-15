import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularMaterialModule } from '../../angular-material/angular-material.module';
import { AddGuestDialogComponent } from './add-guest-dialog.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AddGuestDialogComponent,
  ],
  entryComponents: [
    AddGuestDialogComponent,
  ],
  imports: [
    AngularMaterialModule,
    CommonModule,
    FormsModule,
  ]
})
export class AddGuestDialogModule { }
