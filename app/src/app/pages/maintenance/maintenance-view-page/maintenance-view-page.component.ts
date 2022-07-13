import {
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import {
  ActivatedRoute,
  Router,
} from '@angular/router';
import { Store } from '@ngrx/store';
import { BoatMaintenance } from '../../../../../../api/src/types/boat-maintenance/boat-maintenance';
import { BoatMaintenanceStatus } from '../../../../../../api/src/types/boat-maintenance/boat-maintenance-status';
import { Comment } from '../../../../../../api/src/types/comment/comment';
import { Media } from '../../../../../../api/src/types/media/media';
import { MediaType } from '../../../../../../api/src/types/media/media-type';
import { UserAccessFields } from '../../../../../../api/src/types/user-access/user-access-fields';
import { ICDNState } from '../../../models/cdn-state.interface';

import {
  editMaintenanceRoute,
  resolveMaintenanceRoute,
} from '../../../routes/routes';
import {
  deleteBoatMaintenanceComment,
  deleteBoatMaintenancePicture,
  postBoatMaintenanceComment,
  postBoatMaintenancePictures
} from '../../../store/actions/boat-maintenance.actions';
import { CDN_ACTION_STATE, deleteFile, uploadBoatMaintenancePicture } from '../../../store/actions/cdn.actions';
import { STORE_SLICES } from '../../../store/store';
import { BasePageComponent } from '../../base-page/base-page.component';

@Component({
  selector: 'app-maintenance-view-page',
  templateUrl: './maintenance-view-page.component.html',
  styleUrls: ['./maintenance-view-page.component.scss']
})
export class MaintenanceViewPageComponent extends BasePageComponent implements OnInit {

  public boat_maintenance_id: string;
  public fileToDelete: string;
  public fileToUpload: File;
  public pictures: Media[];
  public allowDelete = false;
  public maintenancePictureInput = 'maintenance_picture_input';
  public uploadProgress = 0;
  public picturesForm: UntypedFormGroup;

  constructor(
    @Inject(MatDialog) dialog: MatDialog,
    @Inject(Store) store: Store<any>,
    @Inject(ActivatedRoute) route: ActivatedRoute,
    @Inject(Router) router: Router,
    @Inject(UntypedFormBuilder) private fb: UntypedFormBuilder,
  ) {
    super(store, route, router, dialog);
    this.buildForm();
  }

  ngOnInit() {
    this.boat_maintenance_id = this.route.snapshot.params.id;

    this.subscribeToStoreSliceWithUser(STORE_SLICES.BOAT_MAINTENANCES, () => {
      (this.picturesForm.get('pictures') as UntypedFormArray).clear();
      this.picturesForm.reset();
    });

    this.subscribeToStoreSliceWithUser(STORE_SLICES.CDN, (cdn: ICDNState) => {
      if (this.fileToUpload) {
        const fileName = this.fileToUpload.name;
        let mediaType: MediaType;

        if (this.fileToUpload.type.startsWith('video/')) {
          mediaType = MediaType.Video;
        } else if (this.fileToUpload.type.startsWith('image/')) {
          mediaType = MediaType.Picture;
        }

        if (cdn[fileName].state === CDN_ACTION_STATE.ERROR) {
          this.fileToUpload = null;

          const fileInput = document.getElementById(this.maintenancePictureInput) as HTMLInputElement;

          if (fileInput) {
            fileInput.value = null;
          }

          this.fileToUpload = null;
        }

        if (cdn[fileName].state === CDN_ACTION_STATE.UPLOADING) {
          this.uploadProgress = cdn[fileName].progress;
        }

        if (cdn[fileName].state === CDN_ACTION_STATE.UPLOADED) {
          const picturesForm = this.picturesForm.get('pictures') as UntypedFormArray;

          picturesForm
            .push(this.fb.group({
              url: this.fb.control(cdn[fileName].url),
              description: this.fb.control(undefined),
              title: this.fb.control(undefined),
              media_type: this.fb.control(mediaType),
            }));

          picturesForm.updateValueAndValidity();
          picturesForm.markAsDirty();
          this.picturesForm.updateValueAndValidity();

          const fileInput = document.getElementById(this.maintenancePictureInput) as HTMLInputElement;

          if (fileInput) {
            fileInput.value = null;
          }

          this.fileToUpload = null;
          this.uploadProgress = 0;
        }
      }

      if (this.fileToDelete) {
        if (cdn[this.fileToDelete].state === CDN_ACTION_STATE.DELETED) {
          const picturesForm = this.picturesForm.get('pictures') as UntypedFormArray;

          const index = picturesForm.controls.findIndex(control => control.get('url').value === this.fileToDelete);

          picturesForm.removeAt(index);

          this.picturesForm.updateValueAndValidity();

          if (picturesForm.length === 0) {
            this.picturesForm.markAsPristine();
          }

          this.fileToDelete = null;
        }

        if (cdn[this.fileToDelete]?.state === CDN_ACTION_STATE.ERROR) {
          this.fileToDelete = null;
        }
      }

    });
  }

  public get editMaintenanceLink(): string {
    return editMaintenanceRoute(this.boat_maintenance_id);
  }

  public get resolveMaintenanceLink(): string {
    return resolveMaintenanceRoute(this.boat_maintenance_id);
  }

  public get title(): string {
    const title = 'Maintenance Request';
    return title;
  }

  public get isMaintenanceResolved(): boolean {
    return this.maintenance.status === BoatMaintenanceStatus.Resolved;
  }

  public get maintenance(): BoatMaintenance {
    if (!this.boat_maintenance_id) {
      return;
    }

    const request = this.maintenances[this.boat_maintenance_id];

    if (request === undefined) {
      this.fetchBoatMaintenance(this.boat_maintenance_id);
    }

    return request;
  }

  public postNewComment(comment: Comment): void {
    this.dispatchAction(postBoatMaintenanceComment({ comment, boat_maintenance_id: this.boat_maintenance_id, notify: true }));
  }

  public deleteComment(comment_id: string): void {
    this.dispatchAction(deleteBoatMaintenanceComment({ comment_id, boat_maintenance_id: this.boat_maintenance_id, notify: true }));
  }

  public get shouldEnableEditButton(): boolean {
    return !!this.user.access[UserAccessFields.EditMaintenanceRequest];
  }

  public get shouldEnableResolveButton(): boolean {
    return !!this.user.access[UserAccessFields.ResolveMaintenanceRequest];
  }

  public deleteCDNFile(formArrayIndex: number): void {
    this.fileToDelete = this.picturesForm.value.pictures[formArrayIndex].url;
    this.dispatchAction(deleteFile({ filePath: this.fileToDelete, notify: true }));
  }

  public uploadNewPicture(pictures: File[]): void {
    this.fileToUpload = pictures[0];
    this.dispatchAction(uploadBoatMaintenancePicture({ file: pictures[0], boat_maintenance_id: this.boat_maintenance_id, notify: true }));
  }

  public deletePicture(picture: Media): void {
    this.dispatchAction(deleteBoatMaintenancePicture({ boat_maintenance_id: this.boat_maintenance_id, picture_id: picture.id }));
  }

  public save(): void {
    const pictures: Media[] = this.picturesForm.value.pictures;

    this.dispatchAction(postBoatMaintenancePictures({ pictures, boat_maintenance_id: this.boat_maintenance_id, notify: true }));
  }

  public get shouldAllowSaveButton(): boolean {
    return this.picturesForm && this.picturesForm.dirty;
  }

  private buildForm(): void {
    this.picturesForm = this.fb.group({
      pictures: this.fb.array([
      ])
    });
  }
}
