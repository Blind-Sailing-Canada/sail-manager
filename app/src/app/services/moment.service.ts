import * as moment from 'moment';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MomentService {

  constructor() {
    moment.updateLocale('en', {
      calendar: {
        lastDay: 'hh:mm A [Yesterday]',
        sameDay: '[Today] @ hh:mm A',
        nextDay: 'hh:mm A [Tomorrow]',
        lastWeek: 'hh:mm A [Last] dddd',
        nextWeek: 'hh:mm A [Next] dddd',
        sameElse: 'hh:mm A dddd, DD MMMM, YYYY'
      }
    });
  }

  public moment(date: string | Date): moment.Moment {
    return moment(date);
  }

  public format(date: string | Date): string {
    const mnt = moment(date);
    const formatedString = mnt.format('MMMM Do YYYY, h:mm a');

    return formatedString;
  }

  public describeDate(date: string | Date, short?: boolean): string {
    const mnt = moment(date);

    if (short) {
      return mnt.format('ddd, MMM DD, YY');
    }

    return mnt.format('dddd, MMMM DD, YYYY');

  }

  public yyyymmdd(date: string | Date): string {
    const mnt = moment(date);

    const formatedValue = mnt.format('YYYY-MM-DD');

    return formatedValue;
  }

  public humanizeDateWithTime(date: string | Date, short: boolean): string {
    const mnt = moment(date);
    const format = {
      lastDay: 'hh:mm A [Yesterday]',
      sameDay: '[Today] @ hh:mm A',
      nextDay: 'hh:mm A [Tomorrow]',
      lastWeek: 'hh:mm A [Last] dddd',
      nextWeek: 'hh:mm A [Next] dddd',
      sameElse: short ? 'hh:mm A ddd, DD MMM, YYYY' : 'hh:mm A dddd, DD MMMM, YYYY',
    };
    const humanDateWithTime = mnt.calendar(undefined, format);

    return humanDateWithTime;
  }

  public humanizeDate(date: string | Date, short?: boolean): string {
    const mnt = moment(date);
    const format = {
      lastDay: '[Yesterday]',
      sameDay: '[Today]',
      nextDay: '[Tomorrow]',
      lastWeek: '[Last] dddd',
      nextWeek: '[Next] dddd',
      sameElse: short ? 'ddd, DD MMM, YYYY' : 'dddd, DD MMMM, YYYY',
    };

    const humanDateWithTime = mnt.calendar(undefined, format);

    return humanDateWithTime;
  }

  public duration(start: string | Date, finish: string | Date): string {
    const foo = moment(start);
    const bar = moment(finish);
    const duration = moment.duration(foo.diff(bar));
    const humanString = duration.humanize();

    return humanString;
  }

}
