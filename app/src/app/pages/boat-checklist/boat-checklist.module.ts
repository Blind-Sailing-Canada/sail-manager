import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AngularMaterialModule } from '../../angular-material/angular-material.module';
import { FieldsetModule } from '../../components/fieldset/fieldset.module';
import { FileSelectModule } from '../../components/file-select/file-select.module';
import { InstructionsFormModule } from '../../components/instructions-form/instructions-form.module';
import { BasePageModule } from '../base-page/base-page.module';
import { BoatChecklistEditPageComponent } from './boat-checklist-edit-page/boat-checklist-edit-page.component';
import { BoatChecklistListPageComponent } from './boat-checklist-list-page/boat-checklist-list-page.component';
import { BoatChecklistViewPageComponent } from './boat-checklist-view-page/boat-checklist-view-page.component';
import { BoatChecklistRoutingModule } from './boat-checklist-routing.module';
import {
  BoatChecklistItemInputModule
} from '../../components/boat-checklist-item/boat-checklist-item-input/boat-checklist-item-input.module';
import {
  BoatChecklistItemSelectModule
} from '../../components/boat-checklist-item/boat-checklist-item-select/boat-checklist-item-select.module';

@NgModule({
  declarations: [
    BoatChecklistEditPageComponent,
    BoatChecklistListPageComponent,
    BoatChecklistViewPageComponent,
  ],
  imports: [
    AngularMaterialModule,
    BasePageModule,
    BoatChecklistItemInputModule,
    BoatChecklistItemSelectModule,
    BoatChecklistRoutingModule,
    CommonModule,
    FieldsetModule,
    FileSelectModule,
    InstructionsFormModule,
    ReactiveFormsModule,
  ]
})
export class BoatChecklistModule { }
