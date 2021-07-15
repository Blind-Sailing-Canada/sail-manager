import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { AngularMaterialModule } from '../../angular-material/angular-material.module';
import { IconTextModule } from '../icon-text/icon-text.module';
import { TableModule } from '../table/table.module';
import { ManifestEditComponent } from './manifest-edit.component';

@NgModule({
  declarations: [
    ManifestEditComponent,
  ],
  exports: [
    ManifestEditComponent,
  ],
  imports: [
    AngularMaterialModule,
    CommonModule,
    FormsModule,
    IconTextModule,
    ReactiveFormsModule,
    TableModule,
  ]
})
export class ManifestEditModule { }
