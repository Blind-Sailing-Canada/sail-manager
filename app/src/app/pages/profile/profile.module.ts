import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularMaterialModule } from '../../angular-material/angular-material.module';
import { FileSelectModule } from '../../components/file-select/file-select.module';
import { LinkAccountsDialogModule } from '../../components/link-accounts-dialog/link-accounts-dialog.module';
import { TableModule } from '../../components/table/table.module';
import { UserProfileModule } from '../../components/user-profile/user-profile.module';
import { PipesModule } from '../../pipes/pipes.module';
import { BasePageModule } from '../base-page/base-page.module';
import { ProfileEditPageComponent } from './profile-edit-page/profile-edit-page.component';
import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileSettingsPageComponent } from './profile-settings-page/profile-settings-page.component';
import { ProfileViewPageComponent } from './profile-view-page/profile-view-page.component';

@NgModule({
  declarations: [
    ProfileEditPageComponent,
    ProfileSettingsPageComponent,
    ProfileViewPageComponent,
  ],
  imports: [
    AngularMaterialModule,
    BasePageModule,
    CommonModule,
    FileSelectModule,
    FormsModule,
    LinkAccountsDialogModule,
    PipesModule,
    ProfileRoutingModule,
    ReactiveFormsModule,
    TableModule,
    UserProfileModule,
  ]
})
export class ProfileModule { }
