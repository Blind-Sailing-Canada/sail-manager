import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularMaterialModule } from '../../angular-material/angular-material.module';
import { AddSailorDialogComponent } from './add-sailor-dialog.component';
import { ListFilterModule } from '../../components/list-filter/list-filter.module';

@NgModule({
  declarations: [
    AddSailorDialogComponent,
  ],
  entryComponents: [
    AddSailorDialogComponent,
  ],
  imports: [
    AngularMaterialModule,
    CommonModule,
    ListFilterModule,
  ]
})
export class AddSailorDialogModule { }
