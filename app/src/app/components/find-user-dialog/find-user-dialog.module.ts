import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularMaterialModule } from '../../angular-material/angular-material.module';
import { FindUserDialogComponent } from './find-user-dialog.component';
import { ListFilterModule } from '../../components/list-filter/list-filter.module';

@NgModule({
  declarations: [
    FindUserDialogComponent,
  ],
  imports: [
    AngularMaterialModule,
    CommonModule,
    ListFilterModule,
  ]
})
export class FindUserDialogModule { }
