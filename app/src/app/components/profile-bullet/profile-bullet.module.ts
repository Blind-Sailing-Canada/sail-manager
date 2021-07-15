import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AngularMaterialModule } from '../../angular-material/angular-material.module';
import { ProfileBulletComponent } from './profile-bullet.component';

@NgModule({
  declarations: [
    ProfileBulletComponent,
  ],
  imports: [
    AngularMaterialModule,
    CommonModule,
  ],
  exports: [
    ProfileBulletComponent,
  ],
})
export class ProfileBulletModule { }
