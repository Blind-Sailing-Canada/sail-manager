import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularMaterialModule } from '../../angular-material/angular-material.module';
import { ListFilterModule } from '../../components/list-filter/list-filter.module';
import { AddSocialAttendantDialogComponent } from './add-social-attendant-dialog.component';

@NgModule({
  declarations: [
    AddSocialAttendantDialogComponent,
  ],
  imports: [
    AngularMaterialModule,
    CommonModule,
    ListFilterModule,
  ]
})
export class AddSocialAttendantDialogModule { }
