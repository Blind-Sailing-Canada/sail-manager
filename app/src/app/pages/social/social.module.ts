import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { AngularMaterialModule } from '../../angular-material/angular-material.module';
import { AddSocialAttendantDialogModule } from '../../components/add-social-attendant-dialog/add-social-attendant-dialog.module';
import { AddSocialGuestDialogModule } from '../../components/add-social-guest-dialog/add-social-guest-dialog.module';
import { CommentListModule } from '../../components/comment-list/comment-list.module';
import { DatePickerModule } from '../../components/date-picker/date-picker.module';
import { DateTimeFormModule } from '../../components/date-time-form/date-time-form.module';
import { FileSelectModule } from '../../components/file-select/file-select.module';
import { IconTextModule } from '../../components/icon-text/icon-text.module';
import { ImageFormModule } from '../../components/image-form/image-form.module';
import { ImageListModule } from '../../components/image-list/image-list.module';
import { ItemPickerModule } from '../../components/item-picker/item-picker.module';
import { ListFilterModule } from '../../components/list-filter/list-filter.module';
import { MaterialTableModule } from '../../components/material-table/material-table.module';
import { NewCommentFormModule } from '../../components/new-comment-form/new-comment-form.module';
import { ProfileBulletModule } from '../../components/profile-bullet/profile-bullet.module';
import { SocialNotificationDialogModule } from '../../components/social-notification-dialog/social-notification-dialog.module';
import { TableModule } from '../../components/table/table.module';
import { TimePickerModule } from '../../components/time-picker/time-picker.module';
import { PipesModule } from '../../pipes/pipes.module';
import { BasePageModule } from '../base-page/base-page.module';
import { SocialCancelPageComponent } from './social-cancel-page/social-cancel-page.component';
import { SocialEditPageComponent } from './social-edit-page/social-edit-page.component';
import { SocialListPageComponent } from './social-list-page/social-list-page.component';
import { SocialManifestEditPageComponent } from './social-manifest-edit-page/social-manifest-edit-page.component';
import { SocialPicturesPageComponent } from './social-pictures-page/social-pictures-page.component';
import { SocialRoutingModule } from './social-routing.module';
import { SocialViewPageComponent } from './social-view-page/social-view-page.component';
import { SocialCreateManyPageComponent } from './social-create-many-page/social-create-many-page.component';

@NgModule({
  declarations: [
    SocialCancelPageComponent,
    SocialEditPageComponent,
    SocialCreateManyPageComponent,
    SocialListPageComponent,
    SocialManifestEditPageComponent,
    SocialPicturesPageComponent,
    SocialViewPageComponent,
  ],
  imports: [
    AddSocialAttendantDialogModule,
    AddSocialGuestDialogModule,
    AngularMaterialModule,
    BasePageModule,
    CommentListModule,
    CommonModule,
    DatePickerModule,
    DateTimeFormModule,
    FileSelectModule,
    FormsModule,
    IconTextModule,
    ImageFormModule,
    ImageListModule,
    ItemPickerModule,
    ListFilterModule,
    MaterialTableModule,
    NewCommentFormModule,
    PipesModule,
    ProfileBulletModule,
    ReactiveFormsModule,
    SocialNotificationDialogModule,
    SocialRoutingModule,
    TableModule,
    TimePickerModule,
  ]
})
export class SocialModule { }
