import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AngularMaterialModule } from '../../angular-material/angular-material.module';
import { InstructionsFormModule } from '../../components/instructions-form/instructions-form.module';
import { InstructionsListModule } from '../../components/instructions-list/instructions-list.module';
import { MediaDialogModule } from '../../components/media-dialog/media-dialog.module';
import { BasePageModule } from '../base-page/base-page.module';
import { BoatInstructionsBasePageComponent } from './boat-instructions-base-page/boat-instructions-base-page.component';
import { BoatInstructionsEditPageComponent } from './boat-instructions-edit-page/boat-instructions-edit-page.component';
import { BoatInstructionsRoutingModule } from './boat-instructions-routing.module';
import { BoatInstructionsViewPageComponent } from './boat-instructions-view-page/boat-instructions-view-page.component';

@NgModule({
  declarations: [
    BoatInstructionsViewPageComponent,
    BoatInstructionsEditPageComponent,
    BoatInstructionsBasePageComponent,
  ],
  imports: [
    AngularMaterialModule,
    BasePageModule,
    BoatInstructionsRoutingModule,
    CommonModule,
    InstructionsFormModule,
    InstructionsListModule,
    MediaDialogModule,
    ReactiveFormsModule,
  ]
})
export class BoatInstructionsModule { }
