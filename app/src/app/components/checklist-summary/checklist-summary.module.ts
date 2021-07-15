import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AngularMaterialModule } from '../../angular-material/angular-material.module';
import { ChecklistViewModule } from '../checklist-view/checklist-view.module';
// import { ManifestViewModule } from '../manifest-view/manifest-view.module';
import { TableModule } from '../table/table.module';
import { ChecklistSummaryComponent } from './checklist-summary.component';

@NgModule({
  declarations: [
    ChecklistSummaryComponent,
  ],
  exports: [
    ChecklistSummaryComponent,
  ],
  imports: [
    AngularMaterialModule,
    ChecklistViewModule,
    CommonModule,
    // ManifestViewModule,
    TableModule,
  ],
})
export class ChecklistSummaryModule { }
