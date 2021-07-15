import {
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  ActivatedRoute,
  Router,
} from '@angular/router';
import { Store } from '@ngrx/store';
import { Boat } from '../../../../../../api/src/types/boat/boat';
import { BoatStatus } from '../../../../../../api/src/types/boat/boat-status';
import { ICDNFileState } from '../../../models/cdn-state.interface';
import { editBoatInstructionsRoute } from '../../../routes/routes';
import {
  createBoat,
  updateBoat,
} from '../../../store/actions/boat.actions';
import {
  CDN_ACTION_STATE,
  deleteFile,
  uploadBoatPicture,
} from '../../../store/actions/cdn.actions';
import { STORE_SLICES } from '../../../store/store';
import { BasePageComponent } from '../../base-page/base-page.component';

@Component({
  selector: 'app-boat-edit-page',
  templateUrl: './boat-edit-page.component.html',
  styleUrls: ['./boat-edit-page.component.css']
})
export class BoatEditPageComponent extends BasePageComponent implements OnInit {

  public formCurrentStep = 0;
  public boatForm: FormGroup;
  public boatStatusValues = Object.values(BoatStatus);
  public boatPictureInputId = 'boatPictureInputId';
  public fileToUpload: File;
  public fileToDelete: string;

  constructor(
    @Inject(Store) store: Store<any>,
    @Inject(ActivatedRoute) route: ActivatedRoute,
    @Inject(FormBuilder) private fb: FormBuilder,
    @Inject(Router) router: Router,
  ) {
    super(store, route, router);
  }

  ngOnInit() {
    if (!this.user) {
      return;
    }

    this.buildForm();
    this.subscribeToStoreSliceWithUser(STORE_SLICES.CDN, (cdn) => {
      if (this.fileToUpload) {
        const cdnFile: ICDNFileState = cdn[this.fileToUpload.name] || {};
        if (cdnFile.state === CDN_ACTION_STATE.UPLOADED) {
          this.addNewPictureToForm(cdnFile.url);
          this.fileToUpload = null;
          const fileInput = document.getElementById(this.boatPictureInputId) as HTMLInputElement;

          if (fileInput) {
            fileInput.value = null;
          }
        }

        if (cdnFile.state === CDN_ACTION_STATE.ERROR) {
          this.fileToUpload = null;
          const fileInput = document.getElementById(this.boatPictureInputId) as HTMLInputElement;

          if (fileInput) {
            fileInput.value = null;
          }
        }
      }

      if (this.fileToDelete) {
        const cdnFile: ICDNFileState = cdn[this.fileToDelete] || {};

        if (cdnFile.state === CDN_ACTION_STATE.DELETED) {
          this.removePictureFromForm(this.fileToDelete);
          this.fileToDelete = null;
        }

        if (cdnFile.state === CDN_ACTION_STATE.ERROR) {
          this.fileToDelete = null;
        }
      }
    });

    this.subscribeToStoreSliceWithUser(STORE_SLICES.BOATS, () => {
      const boat = this.boat;
      if (boat) {
        this.updateForm();
      }
    });

  }

  private buildForm(): void {
    this.boatForm = this.fb.group({
      ballast: this.fb.control(undefined, Validators.required),
      beam: this.fb.control(undefined, Validators.required),
      calendarResourceId: this.fb.control(undefined),
      draft: this.fb.control(undefined, Validators.required),
      hullType: this.fb.control(undefined, Validators.required),
      jibSailArea: this.fb.control(undefined, Validators.required),
      loa: this.fb.control(undefined, Validators.required),
      lwl: this.fb.control(undefined, Validators.required),
      mainSailArea: this.fb.control(undefined, Validators.required),
      material: this.fb.control(undefined, Validators.required),
      maxOccupancy: this.fb.control(undefined, Validators.required),
      model: this.fb.control(undefined),
      name: this.fb.control(undefined, Validators.required),
      phrf: this.fb.control(undefined, Validators.required),
      pictures: this.fb.array([]),
      rig: this.fb.control(undefined, Validators.required),
      status: this.fb.control(undefined, Validators.required),
      wiki: this.fb.control(undefined),
    });

  }

  public get title(): string {
    return this.boatId ? `Edit Boat Form` : 'New Boat Form';
  }

  public get boat(): Boat {
    if (!this.boatId) {
      return;
    }
    const boat = this.boats[this.boatId];
    if (!boat && boat !== null) {
      this.fetchBoat(this.boatId);
    }

    return boat;
  }

  private addNewPictureToForm(url: string): void {
    (this.boatForm.controls.pictures as FormArray).push(this.fb.group({ url }));
    this.boatForm.controls.pictures.updateValueAndValidity();
    this.boatForm.controls.pictures.markAsDirty();
    this.boatForm.updateValueAndValidity();
  }

  private updateForm(): void {
    const boat = this.boat;
    this.boatForm.patchValue(boat);

    const pictures = (this.boatForm.controls.pictures as FormArray);

    while (pictures.length) {
      pictures.removeAt(0);
    }

    boat.pictures.forEach(pic => pictures.push(this.fb.group({ url: pic })));

    this.boatForm.markAsUntouched();
    this.boatForm.markAsPristine();
  }

  public get boatId(): string {
    return this.route.snapshot.params.id;
  }

  public get isFormDirty(): boolean {

    const isDirty: boolean = Object
      .keys(this.boatForm.controls)
      .some(control => this.boatForm.controls[control].dirty);

    return isDirty;
  }

  public get shouldDisableUpdateButton(): boolean {
    const should = !this.boatForm || !this.isFormDirty || !this.boatForm.valid;
    return !!should;
  }

  public get uploadProgress(): number {
    if (!this.fileToUpload) {
      return 0;
    }
    return (this.cdn[this.fileToUpload.name] || {}).progress;
  }

  protected get pictureControls(): AbstractControl[] {
    if (!this.boatForm) {
      return [];
    }

    return (this.boatForm.controls.pictures as FormArray).controls;
  }

  public deletePicture(index: number): void {
    this.fileToDelete = this.boatForm.getRawValue().pictures[index].url;
    if (this.fileToDelete.startsWith('cdn/')) {
      this.dispatchAction(deleteFile({ filePath: this.fileToDelete, notify: true }));
    } else {
      this.removePictureFromForm(this.fileToDelete);
    }
  }

  private removePictureFromForm(url: string): void {
    const existingPictures = (this.boatForm.controls.pictures as FormArray).controls;
    const newPictures = existingPictures.filter(picture => picture.value.url !== url);
    (this.boatForm.controls.pictures as FormArray).controls = newPictures;
    this.boatForm.controls.pictures.markAsDirty();
    this.boatForm.controls.pictures.updateValueAndValidity();
    this.boatForm.markAsDirty();
    this.boatForm.updateValueAndValidity();
  }

  public uploadFileToCDN(files: File[]): void {
    this.fileToUpload = files[0];
    this.dispatchAction(uploadBoatPicture({ file: files[0], boatId: this.boatId, notify: true }));
  }

  public goToBoatInstructions(): void {
    this.goTo([editBoatInstructionsRoute(this.boatId)]);
  }

  public save(): void {

    const formData: any = Object
      .keys(this.boatForm.controls)
      .filter(controlName => this.boatForm.controls[controlName].dirty)
      .reduce(
        (red, controlName) => {
          red[controlName] = this.boatForm.controls[controlName].value;
          return red;
        },
        {},
      );

    if (formData.pictures) {
      formData.pictures = formData.pictures.map(picture => picture.url);
    }

    const boat: Boat = formData as Boat;

    if (this.boatId) {
      this.dispatchAction(updateBoat({ boat, id: this.boatId, }));
    } else {
      this.dispatchAction(createBoat({ boat }));
    }
  }
}
