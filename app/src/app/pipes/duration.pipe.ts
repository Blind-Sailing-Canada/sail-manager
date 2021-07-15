import {
  Inject,
  Pipe,
  PipeTransform,
} from '@angular/core';
import { MomentService } from '../services/moment.service';

@Pipe({ name: 'duration' })
export class DurationPipe implements PipeTransform {
  constructor(
    @Inject(MomentService) private momentService: MomentService,
  ) { }
  transform(start: string | Date, end: string | Date): string {
    if (!start || !end) {
      return 'n/a';
    }

    return this.momentService.duration(start, end);
  }
}
