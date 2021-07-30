import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  Output,
} from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
} from '@angular/forms';
import { ICDNState } from '../../models/cdn-state.interface';
import { CDN_ACTION_STATE } from '../../store/actions/cdn.actions';

@Component({
  selector: 'app-instructions-form',
  templateUrl: './instructions-form.component.html',
  styleUrls: ['./instructions-form.component.css']
})
export class InstructionsFormComponent implements OnChanges {

  @Input() public arrayName: string;
  @Input() public cdn: ICDNState = {};
  @Input() public controls: AbstractControl[];
  @Input() public form: FormGroup;
  @Input() public instruction_type: string;
  @Input() public subtitle: string;
  @Output() public addMore: EventEmitter<void> = new EventEmitter<void>();
  @Output() public remove: EventEmitter<number> = new EventEmitter<number>();
  @Output() public deleteFile: EventEmitter<string> = new EventEmitter<string>();
  @Output() public processFile: EventEmitter<File> = new EventEmitter<File>();

  constructor(@Inject(FormBuilder) private fb: FormBuilder) { }

  private filesToUpload: {
    [propName: string]: {
      file: File,
      index: number
    }
  } = {};

  private filesToDelete: {
    [propName: string]: {
      url: string,
      controlIndex: number,
    }
  } = {};

  ngOnChanges(): void {
    Object
      .keys(this.filesToUpload)
      .forEach((fileName) => {
        const cdnFile = this.cdn[fileName];
        const controlIndex = this.filesToUpload[fileName].index;

        if (cdnFile && cdnFile.state === CDN_ACTION_STATE.ERROR) {
          delete this.filesToUpload[fileName];
          const fileInput = document.getElementById(this.instructionFileInput(controlIndex)) as HTMLInputElement;
          if (fileInput) {
            fileInput.value = null;
          }
        }

        if (cdnFile && cdnFile.state === CDN_ACTION_STATE.UPLOADED) {
          this.addNewPicture(cdnFile.url, controlIndex);
          delete this.filesToUpload[fileName];
          const fileInput = document.getElementById(this.instructionFileInput(controlIndex)) as HTMLInputElement;
          if (fileInput) {
            fileInput.value = null;
          }
        }
      });

    Object
      .keys(this.filesToDelete)
      .forEach((fileName) => {
        const cdnFile = this.cdn[fileName];
        const controlIndex = this.filesToDelete[fileName].controlIndex;

        if (cdnFile && cdnFile.state === CDN_ACTION_STATE.ERROR) {
          delete this.filesToDelete[fileName];
        }

        if (cdnFile && cdnFile.state === CDN_ACTION_STATE.DELETED) {
          this.removePicture(fileName, controlIndex);
          delete this.filesToDelete[fileName];
        }
      });
  }

  public addMoreHandler(): void {
    this.addMore.emit();
  }

  public get subtitleWithoutSpaces(): string {
    if (!this.subtitle) {
      return '';
    }

    return this.subtitle.replace(/ /g, '_');
  }

  public deletePicture(pictureIndex: number, controlIndex: number): void {
    const pictureUrl = this.controls[controlIndex].value.media[pictureIndex].url;
    this.filesToDelete[pictureUrl] = { controlIndex, url: pictureUrl };
    this.deleteFile.emit(pictureUrl);
  }

  public pictureControls(instruction: AbstractControl): AbstractControl[] {
    const existingPictures = (instruction.get('media') as FormArray).controls;
    return existingPictures;
  }

  public instructionFileInput(index: number): string {
    return `${this.instruction_type || 'instructions'}PictureInput${index}`;
  }

  public uploadProgress(index: number): number {
    const uploadingFile = Object.values(this.filesToUpload).find(file => file.index === index);
    if (uploadingFile) {
      const fileName = uploadingFile.file.name;
      return (this.cdn[fileName] || {}).progress;
    }
    return 0;
  }

  private removePicture(url: string, index: number): void {
    this.controls.forEach((control) => {
      const pictures = (control.get('media') as FormArray);
      let found = true;
      while (found) {
        const picIndex = pictures.controls.findIndex(pic => pic.get('url').value === url);
        if (picIndex !== -1) {
          found = true;
          pictures.removeAt(picIndex);
          pictures.markAsDirty();
          control.markAsDirty();
        } else {
          found = false;
        }
      }
    });
  }

  private addNewPicture(url: string, index: number): void {
    const control = this.controls[index];
    const newPicture = this.fb.group({
      description: this.fb.control(''),
      url: this.fb.control(url),
    });

    (control.get('media') as FormArray).push(newPicture);

    control.get('media').markAsDirty();
    control.markAsDirty();
  }

  public uploadFileToCDN(files: File[], index: number): void {
    this.filesToUpload[files[0].name] = { index, file: files[0] };
    this.processFile.emit(files[0]);
  }
}
