import { fromEvent } from 'rxjs';
import {
  debounceTime,
  map,
  takeWhile,
} from 'rxjs/operators';
import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-list-filter',
  templateUrl: './list-filter.component.html',
  styleUrls: ['./list-filter.component.css']
})
export class ListFilterComponent implements AfterViewInit, OnDestroy {

  @Input() ariaLabel = '';
  @Input() controls = '';
  @Input() debounceMS = 500;
  @Input() id = 'listFilterInput';
  @Input() label = '';
  @Input() tooltip = '';
  @Output() filter: EventEmitter<string> = new EventEmitter<string>();
  @ViewChild('listFilterInput', { static: false }) private listFilterInput;
  private active = true;

  ngOnDestroy(): void {
    this.active = false;
  }

  ngAfterViewInit(): void {
    const typeahead = fromEvent(this.listFilterInput.nativeElement, 'input')
      .pipe(
        takeWhile(() => this.active),
        map((event: any) => (event.target.value || '') as string),
        debounceTime(this.debounceMS),
        map(text => text ? text.trim() : ''),
      );

    typeahead
      .subscribe((filterText: string) => {
        this.filter.emit(filterText);
      });
  }

}
