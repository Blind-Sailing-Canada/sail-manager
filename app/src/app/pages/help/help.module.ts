import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HelpPageComponent } from './help-page/help-page.component';
import { AngularMaterialModule } from '../../angular-material/angular-material.module';
import { HelpRoutingModule } from './help-routing.module';

@NgModule({
  declarations: [HelpPageComponent],
  imports: [
    AngularMaterialModule,
    CommonModule,
    HelpRoutingModule,
  ]
})
export class HelpModule { }
