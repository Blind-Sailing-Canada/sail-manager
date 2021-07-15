import { NgxFilesizeModule } from 'ngx-filesize';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AngularMaterialModule } from '../../angular-material/angular-material.module';
import { IconTextModule } from '../icon-text/icon-text.module';
import { FileSelectComponent } from './file-select.component';

@NgModule({
  declarations: [
    FileSelectComponent,
  ],
  exports: [
    FileSelectComponent,
  ],
  imports: [
    AngularMaterialModule,
    CommonModule,
    IconTextModule,
    NgxFilesizeModule,
  ]
})
export class FileSelectModule { }
