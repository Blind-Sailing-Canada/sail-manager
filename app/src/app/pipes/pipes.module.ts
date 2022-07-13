import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DurationPipe } from './duration.pipe';
import {
  FormatDateDDMMYYYYPipe,
  FormatDatePipe,
  FormatDateYYYYMMDDPipe,
  HumanDatePipe,
  HumanDateWithTimePipe,
  TimePipe,
} from './human-date.pipe';
import { MarkdownPipe } from './markdown.pipe';

@NgModule({
  declarations: [
    DurationPipe,
    FormatDateDDMMYYYYPipe,
    FormatDatePipe,
    FormatDateYYYYMMDDPipe,
    HumanDatePipe,
    HumanDateWithTimePipe,
    MarkdownPipe,
    TimePipe,
  ],
  exports: [
    DurationPipe,
    FormatDateDDMMYYYYPipe,
    FormatDatePipe,
    FormatDateYYYYMMDDPipe,
    HumanDatePipe,
    HumanDateWithTimePipe,
    MarkdownPipe,
    TimePipe,
  ],
  imports: [
    CommonModule,
  ]
})
export class PipesModule { }
