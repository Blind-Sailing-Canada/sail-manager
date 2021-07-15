import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AngularMaterialModule } from '../../angular-material/angular-material.module';
import { BoatListModule } from '../../components/boat-list/boat-list.module';
import { BoatTableModule } from '../../components/boat-table/boat-table.module';
import { FieldsetModule } from '../../components/fieldset/fieldset.module';
import { FileSelectModule } from '../../components/file-select/file-select.module';
import { ImageFormModule } from '../../components/image-form/image-form.module';
import { ImageListModule } from '../../components/image-list/image-list.module';
import { InstructionsFormModule } from '../../components/instructions-form/instructions-form.module';
import { TableModule } from '../../components/table/table.module';
import { BasePageModule } from '../base-page/base-page.module';
import { BoatEditPageComponent } from './boat-edit-page/boat-edit-page.component';
import { BoatListPageComponent } from './boat-list-page/boat-list-page.component';
import { BoatRoutingModule } from './boat-routing.module';
import { BoatViewPageComponent } from './boat-view-page/boat-view-page.component';

@NgModule({
  declarations: [
    BoatEditPageComponent,
    BoatListPageComponent,
    BoatViewPageComponent,
  ],
  imports: [
    AngularMaterialModule,
    BasePageModule,
    BoatListModule,
    BoatRoutingModule,
    BoatTableModule,
    CommonModule,
    FieldsetModule,
    FileSelectModule,
    ImageFormModule,
    ImageListModule,
    InstructionsFormModule,
    ReactiveFormsModule,
    TableModule,
  ]
})
export class BoatModule { }
