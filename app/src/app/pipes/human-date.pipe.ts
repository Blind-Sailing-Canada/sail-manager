import {
  Inject,
  Pipe,
  PipeTransform,
} from '@angular/core';
import { MomentService } from '../services/moment.service';

@Pipe({ name: 'humanDateWithTime' })
export class HumanDateWithTimePipe implements PipeTransform {
  constructor(
    @Inject(MomentService) private momentService: MomentService,
  ) { }
  transform(date: string | Date, short?: boolean): string {
    if (!date) {
      return 'n/a';
    }

    return this.momentService.humanizeDateWithTime(date, short);
  }
}

@Pipe({ name: 'humanDate' })
export class HumanDatePipe implements PipeTransform {
  constructor(
    @Inject(MomentService) private momentService: MomentService,
  ) { }
  transform(date: string | Date, short?: boolean): string {
    if (!date) {
      return 'n/a';
    }

    return this.momentService.humanizeDate(date, short);
  }
}

@Pipe({ name: 'time' })
export class TimePipe implements PipeTransform {
  constructor(
    @Inject(MomentService) private momentService: MomentService,
  ) { }
  transform(date: string | Date): string {
    if (!date) {
      return 'n/a';
    }

    return this.momentService.time(date);
  }
}

@Pipe({ name: 'formatDate' })
export class FormatDatePipe implements PipeTransform {
  constructor(
    @Inject(MomentService) private momentService: MomentService,
  ) { }
  transform(date: string | Date, short?: boolean): string {
    if (!date) {
      return 'n/a';
    }

    return this.momentService.describeDate(date, short);
  }
}

@Pipe({ name: 'yyyymmdd' })
export class FormatDateYYYYMMDDPipe implements PipeTransform {
  constructor(
    @Inject(MomentService) private momentService: MomentService,
  ) { }
  transform(date: string | Date): string {
    if (!date) {
      return 'n/a';
    }

    return this.momentService.yyyymmdd(date);
  }
}


@Pipe({ name: 'ddmmyyyy' })
export class FormatDateDDMMYYYYPipe implements PipeTransform {
  constructor(
    @Inject(MomentService) private momentService: MomentService,
  ) { }
  transform(date: string | Date): string {
    if (!date) {
      return 'n/a';
    }

    return this.momentService.ddmmyyyy(date);
  }
}
