import {
  fromEvent,
  of,
} from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  switchMap,
  takeWhile,
} from 'rxjs/operators';
import {
  AfterViewInit,
  Component,
  Input,
  OnChanges,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatSelectionList } from '@angular/material/list';

@Component({
  selector: 'app-item-picker',
  styleUrls: ['./item-picker.component.css'],
  templateUrl: './item-picker.component.html',
})
export class ItemPickerComponent implements OnChanges, AfterViewInit, OnDestroy {

  @Input() public controlName: string;
  @Input() public displayLimit = 4;
  @Input() public displayProperty = 'name';
  @Input() public form: FormGroup;
  @Input() public itemType: string;
  @Input() public items = {};
  @Input() public max = 1;
  @ViewChild('availableList', { static: false }) private availableList: MatSelectionList;
  @ViewChild('itemFilter', { static: false }) private itemFilter;
  @ViewChild('selectedList', { static: false }) private selectedList: MatSelectionList;

  public availableItemIds: string[] = [];
  public selectedItemIds: string[] = [];

  private filter = '';
  private itemIds: string[] = [];
  private active = true;

  get maxSelection() {
    return +this.max;
  }

  ngOnDestroy() {
    this.active = false;
  }

  ngAfterViewInit(): void {
    const typeahead = fromEvent(this.itemFilter.nativeElement, 'input')
      .pipe(
        takeWhile(() => this.active),
        map((e: any) => e.target.value),
        debounceTime(500),
        distinctUntilChanged(),
        switchMap(text => of(text))
      );

    typeahead
      .subscribe((filt) => {
        this.filter = filt;
        this.filterItems();
      });
  }

  ngOnChanges(): void {
    this.selectedItemIds = [].concat(this.form.controls[this.controlName].value || []);
    this.filterItems();
  }

  public getItemProperty(itemId, property) {
    const item = this.items[itemId] || { [property]: 'Failed to fetch' };
    const value = item[property];
    return value;
  }

  public selectionListener($event) {
    if (this.maxSelection > 1) {
      return;
    }

    const option = $event.option;
    this.availableList.selectedOptions.clear();
    this.availableList.selectedOptions.select(option);
  }

  public shouldDisabledAdd() {
    const available = this.availableList && this.availableList.selectedOptions.selected.length;
    const selected = this.selectedList && this.selectedList.options.length;
    const should = !available || (available + selected) > this.maxSelection;

    return !!should;
  }

  public shouldDisabledRemove() {
    const selected = this.selectedList && this.selectedList.selectedOptions.selected.length;
    const should = !selected;

    return !!should;
  }

  public addItem() {
    const selected = this.availableList.selectedOptions.selected.map(op => op.value);
    this.selectedItemIds = this.selectedItemIds.concat(selected);
    this.selectedItemIds = this.selectedItemIds.slice(0, this.max);

    this.updateSelection();
  }

  public removeItem() {
    const selected = this.selectedList.selectedOptions.selected.map(op => op.value);
    this.selectedItemIds = this.selectedItemIds.filter(id => !selected.includes(id));

    this.updateSelection();
  }

  private updateSelection() {
    this.filterItems();

    if (this.maxSelection === 1) {
      this.form.controls[this.controlName].setValue(this.selectedItemIds[0]);
    } else {
      this.form.controls[this.controlName].setValue(this.selectedItemIds);
    }

    this.form.controls[this.controlName].markAsDirty();
  }

  private filterItems() {
    const filter = new RegExp(this.filter, 'ig');
    this.itemIds = Object.keys(this.items);
    this.availableItemIds = this.itemIds
      .filter(id => !this.selectedItemIds.includes(id)
        && this.items[id][this.displayProperty].match(filter)).slice(0, this.displayLimit);
  }

}
