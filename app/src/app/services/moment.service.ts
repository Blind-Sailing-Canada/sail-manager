import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MomentService {

  public format(date: string | Date): string {
    if (!date) {
      return '';
    }

    const formattedString = new Date(date).toLocaleTimeString([], { month: 'long', day: '2-digit', year: 'numeric', hour12: true });

    return formattedString;
  }

  public describeDate(date: string | Date, short?: boolean): string {
    if (!date) {
      return '';
    }

    const size = short ? 'short' : 'long';
    const digits = short ? '2-digit' : 'numeric';

    return new Date(date).toLocaleString([], { weekday: size, month: size, day: digits, year: digits });
  }

  public yyyymmdd(date: string | Date): string {
    if (!date) {
      return '';
    }

    const formattedValue = new Date(date)
      .toLocaleString('en-us', { year: 'numeric', month: '2-digit', day: '2-digit' })
      .replace(/(\d+)\/(\d+)\/(\d+)/, '$3-$1-$2');

    return formattedValue;
  }

  public humanizeDateWithTime(date: string | Date, short: boolean): string {
    if (!date) {
      return '';
    }

    const size = short ? 'short' : 'long';
    const digits = short ? '2-digit' : 'numeric';

    return new Date(date).toLocaleTimeString([], { month: size, day: digits, year: digits, hour12: true });
  }

  public humanizeDate(date: string | Date, short?: boolean): string {
    if (!date) {
      return '';
    }

    const size = short ? 'short' : 'long';
    const digits = short ? '2-digit' : 'numeric';

    return new Date(date).toLocaleString([], { weekday: size, month: size, day: digits, year: digits });
  }

  public duration(start: string | Date, finish: string | Date): string {
    const date1 = new Date(start);
    const date2 = new Date(finish);

    const duration = date2.valueOf() - date1.valueOf();
    const hourDiff = (duration / 1000) / 3600;

    return `${hourDiff} hours.`;
  }

}
