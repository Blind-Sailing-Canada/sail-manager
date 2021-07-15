import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AngularMaterialModule } from '../../angular-material/angular-material.module';
import { ProfileBulletModule } from '../profile-bullet/profile-bullet.module';
import { HeaderComponent } from './header.component';

@NgModule({
  declarations: [
    HeaderComponent,
  ],
  imports: [
    AngularMaterialModule,
    CommonModule,
    ProfileBulletModule,
    RouterModule,
  ],
  exports: [
    HeaderComponent,
  ]
})
export class HeaderModule { }
