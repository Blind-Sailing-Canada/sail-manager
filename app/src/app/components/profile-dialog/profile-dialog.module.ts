import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileDialogComponent } from './profile-dialog.component';
import { AngularMaterialModule } from '../../angular-material/angular-material.module';

@NgModule({
  declarations: [ProfileDialogComponent],
  entryComponents: [ProfileDialogComponent],
  imports: [
    AngularMaterialModule,
    CommonModule,
  ]
})
export class ProfileDialogModule { }
