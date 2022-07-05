import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularMaterialModule } from '../../angular-material/angular-material.module';
import { ListFilterModule } from '../../components/list-filter/list-filter.module';
import { LinkAccountsDialogComponent } from './link-accounts-dialog.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    LinkAccountsDialogComponent,
  ],
  imports: [
    AngularMaterialModule,
    CommonModule,
    ListFilterModule,
    ReactiveFormsModule,
  ]
})
export class LinkAccountsDialogModule { }
