import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularMaterialModule } from '../../angular-material/angular-material.module';
import { AddGroupMemberDialogComponent } from './add-group-member-dialog.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AddGroupMemberDialogComponent,
  ],
  imports: [
    AngularMaterialModule,
    CommonModule,
    FormsModule,
  ]
})
export class AddGroupMemberDialogModule { }
