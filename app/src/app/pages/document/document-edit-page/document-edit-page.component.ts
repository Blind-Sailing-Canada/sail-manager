import {
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  ActivatedRoute,
  Router,
} from '@angular/router';
import { Store } from '@ngrx/store';

import { STORE_SLICES } from '../../../store/store';
import { Document } from '../../../../../../api/src/types/document/document';
import { createDocument, updateDocument } from '../../../store/actions/document.actions';
import { CDN_ACTION_STATE, uploadDocument } from '../../../store/actions/cdn.actions';
import { ICDNState } from '../../../models/cdn-state.interface';
import { DocumentBasePageComponent } from '../document-base-page/document-base-page';

@Component({
  selector: 'app-document-edit-page',
  templateUrl: './document-edit-page.component.html',
  styleUrls: ['./document-edit-page.component.css']
})
export class DocumentEditPageComponent extends DocumentBasePageComponent implements OnInit {

  public document: Document;
  public document_id: string;
  public form: FormGroup;
  public documentInputId = 'documentFileInput';

  private fileToUpload: File;

  constructor(
    @Inject(Store) store: Store<any>,
    @Inject(ActivatedRoute) route: ActivatedRoute,
    @Inject(Router) router: Router,
    @Inject(FormBuilder) private fb: FormBuilder,
  ) {
    super(store, route, router);
    this.buildForm();
  }

  ngOnInit() {
    super.ngOnInit();

    if (!this.user) {
      return;
    }

    this.document_id = this.route.snapshot.params.document_id;

    this.subscribeToStoreSliceWithUser(STORE_SLICES.DOCUMENTS, () => {
      this.document = this.getDocument(this.document_id);

      if (this.document) {
        this.updateForm();
      }
    });

    this.subscribeToStoreSliceWithUser(STORE_SLICES.CDN, (cdn: ICDNState) => {
      if (!this.fileToUpload) {
        return;
      }

      const fileName = this.fileToUpload.name;
      if (cdn[fileName].state === CDN_ACTION_STATE.ERROR) {
        this.fileToUpload = null;

        const fileInput = document.getElementById(this.documentInputId) as HTMLInputElement;

        if (fileInput) {
          fileInput.value = null;
        }
      }

      if (cdn[fileName].state === CDN_ACTION_STATE.UPLOADED) {
        this.form.controls.fileLocation.patchValue(this.cdn[fileName].url);
        this.form.controls.fileLocation.markAsDirty();
        this.form.markAsDirty();
        this.fileToUpload = null;

        const fileInput = document.getElementById(this.documentInputId) as HTMLInputElement;

        if (fileInput) {
          fileInput.value = null;
        }

      }
    });
  }

  public uploadFileToCDN(files: File[]): void {
    this.fileToUpload = files[0];
    this.dispatchAction(uploadDocument({ file: files[0], document_id: this.document_id, notify: true }));
  }

  public get uploadProgress(): number {
    return this.fileToUpload ? this.cdn[this.fileToUpload.name].progress : 0;
  }

  public formErrors(controlName: string): string[] {
    const errors = Object.keys(this.form.controls[controlName].errors || {});
    return errors;
  }

  public get shouldEnableCreateButton(): boolean {
    return !this.document_id && this.form && this.form.valid && this.form.dirty;
  }

  public get shouldEnableSaveButton(): boolean {
    return this.document_id && this.form && this.form.valid && this.form.dirty;
  }

  public createDocument(): void {
    const document: Partial<Document> = this.form.getRawValue();

    this.dispatchAction(createDocument({ document }));
  }

  public get formTitle(): string {
    return this.document_id ? 'Edit Document Form' : 'New Document Form';
  }

  public saveDocument(): void {
    const document: Partial<Document> = Object
      .keys(this.form.controls)
      .filter(key => this.form.get(key).dirty)
      .reduce(
        (red, key) => {
          red[key] = this.form.get(key).value;
          return red;
        },
        {},
      ) as Document;


    this.dispatchAction(updateDocument({ document, document_id: this.document_id, notify: true }));
  }

  private updateForm(): void {
    this.form.patchValue({ ...this.document });
    this.form.updateValueAndValidity();
    this.form.markAsPristine();
  }

  private buildForm(): void {
    this.form = this.fb.group({
      title: this.fb.control(null, Validators.required),
      description: this.fb.control(undefined, Validators.required),
      fileLocation: this.fb.control(undefined, this.document_id ? Validators.required : undefined),
      documentable_type: this.fb.control(this.entity_type),
      documentable_id: this.fb.control(this.entity_id),
    });
  }
}
