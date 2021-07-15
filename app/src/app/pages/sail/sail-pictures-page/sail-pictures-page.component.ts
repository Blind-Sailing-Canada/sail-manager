import {
  map,
  take,
} from 'rxjs/operators';
import {
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import {
  ActivatedRoute,
  Router,
} from '@angular/router';
import { Store } from '@ngrx/store';

import { ICDNState } from '../../../models/cdn-state.interface';
import { SailPicturesService } from '../../../services/sail-pictures.service';
import {
  CDN_ACTION_STATE, deleteFile, uploadSailPicture,
} from '../../../store/actions/cdn.actions';
import { STORE_SLICES } from '../../../store/store';
import { BasePageComponent } from '../../base-page/base-page.component';
import { Sail } from '../../../../../../api/src/types/sail/sail';
import { Media } from '../../../../../../api/src/types/media/media';

@Component({
  selector: 'app-sail-pictures-page',
  templateUrl: './sail-pictures-page.component.html',
  styleUrls: ['./sail-pictures-page.component.css']
})
export class SailPicturesPageComponent extends BasePageComponent implements OnInit {

  public allowDelete = false;
  public fileToDelete: string;
  public fileToUpload: File;
  public form: FormGroup;
  public pictures: Media[];
  public sail: Sail;
  public sailId: string;
  public sailPictureInput = 'sail_picture_input';
  public uploadProgress = 0;

  constructor(
    @Inject(Store) store: Store<any>,
    @Inject(ActivatedRoute) route: ActivatedRoute,
    @Inject(Router) router: Router,
    @Inject(FormBuilder) private fb: FormBuilder,
    @Inject(SailPicturesService) private picturesService: SailPicturesService,
    @Inject(MatDialog) dialog: MatDialog,
  ) {
    super(store, route, router, dialog);
    this.buildForm();
  }

  ngOnInit() {
    this.sailId = this.route.snapshot.params.id;

    this.subscribeToStoreSliceWithUser(STORE_SLICES.PROFILES);
    this.subscribeToStoreSliceWithUser(STORE_SLICES.SAILS, () => {
      if (!this.sail && this.sail !== null) {
        this.sail = this.getSail(this.sailId);
      }
    });
    this.subscribeToStoreSliceWithUser(STORE_SLICES.CDN, (cdn: ICDNState) => {
      if (this.fileToUpload) {
        const fileName = this.fileToUpload.name;
        if (cdn[fileName].state === CDN_ACTION_STATE.ERROR) {
          this.fileToUpload = null;

          const fileInput = document.getElementById(this.sailPictureInput) as HTMLInputElement;

          if (fileInput) {
            fileInput.value = null;
          }

          this.fileToUpload = null;
        }

        if (cdn[fileName].state === CDN_ACTION_STATE.UPLOADING) {
          this.uploadProgress = cdn[fileName].progress;
        }

        if (cdn[fileName].state === CDN_ACTION_STATE.UPLOADED) {
          const picturesForm = this.form.get('pictures') as FormArray;
          this.uploadProgress = 0;

          picturesForm
            .push(this.fb.group({
              url: this.fb.control(cdn[fileName].url),
              description: this.fb.control(undefined),
              title: this.fb.control(undefined),
            }));

          picturesForm.updateValueAndValidity();
          picturesForm.markAsDirty();
          this.form.updateValueAndValidity();

          const fileInput = document.getElementById(this.sailPictureInput) as HTMLInputElement;

          if (fileInput) {
            fileInput.value = null;
          }

          this.fileToUpload = null;
        }
      }

      if (this.fileToDelete) {
        if (cdn[this.fileToDelete].state === CDN_ACTION_STATE.DELETED) {
          const picturesForm = this.form.get('pictures') as FormArray;

          const index = picturesForm.controls.findIndex(control => control.get('url').value === this.fileToDelete);

          picturesForm.removeAt(index);

          this.form.updateValueAndValidity();

          if (picturesForm.length === 0) {
            this.form.markAsPristine();
          }

          this.fileToDelete = null;
        }

        if (cdn[this.fileToDelete]?.state === CDN_ACTION_STATE.ERROR) {
          this.fileToDelete = null;
        }
      }

    });
    this.getSailPictures();
  }

  private buildForm(): void {
    this.form = this.fb.group({
      pictures: this.fb.array([
      ])
    });
  }

  public getSailPictures(): void {
    this.picturesService
      .getPictures(this.sailId)
      .pipe(
        take(1),
        map(pictures => pictures || [] as Media[]))
      .subscribe(pictures => this.pictures = pictures);
  }

  public uploadNewPicture(pictures: File[]): void {
    this.fileToUpload = pictures[0];
    this.dispatchAction(uploadSailPicture({ file: pictures[0], sailId: this.sailId, notify: true }));
  }

  public deleteCDNFile(formArrayIndex: number): void {
    this.fileToDelete = this.form.value.pictures[formArrayIndex].url;
    this.dispatchAction(deleteFile({ filePath: this.fileToDelete, notify: true }));
  }

  public deletePicture(picture: Media): void {
    this.picturesService
      .deletePicture(this.sailId, picture.id)
      .pipe(take(1))
      .subscribe(pictures => this.pictures = pictures);
  }

  public get shouldEnableSubmitButton(): boolean {
    return this.form && this.form.dirty;
  }

  public submitPictures(): void {
    const pictures = this.form.value.pictures as Media[];

    if (pictures) {
      this.picturesService
        .addNewPictures(this.sailId, pictures)
        .pipe(take(1))
        .subscribe((sailPictures) => {
          this.pictures = sailPictures;
          (this.form.get('pictures') as FormArray).clear();
          this.form.updateValueAndValidity();
          this.form.markAsPristine();
        });
    }
  }

}
