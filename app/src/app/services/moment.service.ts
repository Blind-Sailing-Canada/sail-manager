import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MomentService {

  public format(date: string | Date): string {
    const formatedString = new Date(date).toLocaleTimeString([], { month: 'long', day: '2-digit', year: 'numeric', hour12: true });

    return formatedString;
  }

  public describeDate(date: string | Date, short?: boolean): string {
    if (short) {
      return new Date(date).toLocaleString([], { weekday: 'short', month: 'short', day: '2-digit', year: '2-digit' });
    }

    return new Date(date).toLocaleString([], { weekday: 'long', month: 'long', day: '2-digit', year: 'numeric' });
  }

  public yyyymmdd(date: string | Date): string {

    const formatedValue = new Date(date)
      .toLocaleString('en-us', { year: 'numeric', month: '2-digit', day: '2-digit' })
      .replace(/(\d+)\/(\d+)\/(\d+)/, '$3-$1-$2');

    return formatedValue;
  }

  public humanizeDateWithTime(date: string | Date, short: boolean): string {
    // const mnt = moment(new Date(date));
    // const format = {
    //   lastDay: 'hh:mm A [Yesterday]',
    //   sameDay: '[Today] @ hh:mm A',
    //   nextDay: 'hh:mm A [Tomorrow]',
    //   lastWeek: 'hh:mm A [Last] dddd',
    //   nextWeek: 'hh:mm A [Next] dddd',
    //   sameElse: short ? 'hh:mm A ddd, DD MMM, YYYY' : 'hh:mm A dddd, DD MMMM, YYYY',
    // };
    // const humanDateWithTime = mnt.calendar(undefined, format);

    // return humanDateWithTime;

    console.log('humanizeDateWithTime', date);
    console.log(
      `new Date(date).toLocaleTimeString([], { month: 'long', day: '2-digit', year: 'numeric', hour12: true })`,
      new Date(date).toLocaleTimeString([], { month: 'long', day: '2-digit', year: 'numeric', hour12: true }));
    return new Date(date).toLocaleTimeString([], { month: 'long', day: '2-digit', year: 'numeric', hour12: true });
  }

  public humanizeDate(date: string | Date, short?: boolean): string {
    // const mnt = moment(date);
    // const format = {
    //   lastDay: '[Yesterday]',
    //   sameDay: '[Today]',
    //   nextDay: '[Tomorrow]',
    //   lastWeek: '[Last] dddd',
    //   nextWeek: '[Next] dddd',
    //   sameElse: short ? 'ddd, DD MMM, YYYY' : 'dddd, DD MMMM, YYYY',
    // };

    // const humanDateWithTime = mnt.calendar(undefined, format);

    // return humanDateWithTime;
    return new Date(date).toLocaleString([], { weekday: 'short', month: 'short', day: '2-digit', year: '2-digit' });
  }

  public duration(start: string | Date, finish: string | Date): string {
    // const foo = moment(start);
    // const bar = moment(finish);
    // const duration = moment.duration(foo.diff(bar));
    // const humanString = duration.humanize();

    // return humanString;
    return '';
  }

}
