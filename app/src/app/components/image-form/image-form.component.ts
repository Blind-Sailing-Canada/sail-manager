import {
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import {
  AbstractControl,
  UntypedFormArray,
  UntypedFormGroup,
} from '@angular/forms';
import { MediaType } from '../../../../../api/src/types/media/media-type';

@Component({
  selector: 'app-image-form',
  templateUrl: './image-form.component.html',
  styleUrls: ['./image-form.component.css']
})
export class ImageFormComponent {

  @Input() allowDescription = false;
  @Input() allowTitle = false;
  @Input() controlArrayName: string;
  @Input() form: UntypedFormGroup | AbstractControl;
  @Input() allowDelete = false;
  @Output() deleteClick: EventEmitter<number> = new EventEmitter<number>();
  public MediaTypes = MediaType;

  public deleteImage(index: number): void {
    this.deleteClick.emit(index);
  }

  public get controlsArray(): AbstractControl[] {
    return (this.form.get(this.controlArrayName) as UntypedFormArray).controls;
  }

  public get formGroup() {
    return this.form as UntypedFormGroup;
  }

}
