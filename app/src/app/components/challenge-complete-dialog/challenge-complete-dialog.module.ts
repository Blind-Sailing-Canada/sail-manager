import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularMaterialModule } from '../../angular-material/angular-material.module';
import { ChallengeCompleteDialogComponent } from './challenge-complete-dialog.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    ChallengeCompleteDialogComponent,
  ],
  imports: [
    AngularMaterialModule,
    CommonModule,
    FormsModule
  ]
})
export class ChallengeCompleteDialogModule { }
