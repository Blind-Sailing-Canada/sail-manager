import {
  AfterViewInit,
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { BasePageComponent } from '../../base-page/base-page.component';
import { MediaService } from '../../../services/media.service';
import { Media } from '../../../../../../api/src/types/media/media';
import {  firstValueFrom, take  } from 'rxjs';
import { STORE_SLICES } from '../../../store/store';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { WindowService } from '../../../services/window.service';
import { MediaType } from '../../../../../../api/src/types/media/media-type';
import { FormBuilder, FormGroup, UntypedFormArray } from '@angular/forms';
import { listMediaRoute } from '../../../routes/routes';
import { MediaTagService } from '../../../services/media-tag.service';
import { MediaTag } from '../../../../../../api/src/types/media-tag/media-tag';
import { FindUserDialogData } from '../../../models/find-user-dialog-data.interface';
import { FindUserDialogComponent } from '../../../components/find-user-dialog/find-user-dialog.component';
import { ProfileService } from '../../../services/profile.service';
import { Profile } from '../../../../../../api/src/types/profile/profile';

@Component({
  selector: 'app-media-edit-page',
  styleUrls: ['./media-edit-page.component.scss'],
  templateUrl: './media-edit-page.component.html',
})
export class MediaEditPageComponent extends BasePageComponent implements OnInit, AfterViewInit {
  private findUserDialogRef: MatDialogRef<FindUserDialogComponent>;
  public media: Media;
  public width = 250;
  public height = 250;
  public MediaTypes = MediaType;
  public form: FormGroup;
  public selfTag: MediaTag;
  private foundUsers: Profile[];

  constructor(
    @Inject(Router) router: Router,
    @Inject(ActivatedRoute) route: ActivatedRoute,
    @Inject(Store) store: Store<any>,
    @Inject(MediaService) mediaService: MediaService,
    @Inject(MediaTagService) mediaTagService: MediaTagService,
    @Inject(FormBuilder) private fb: FormBuilder,
    @Inject(MatDialog) dialog: MatDialog,
    @Inject(WindowService) public windowService: WindowService,
    @Inject(ProfileService) public profileService: ProfileService,
  ) {
    super(store, route, router, dialog, mediaService, mediaTagService);
  }

  ngOnInit() {
    this.buildForm();

    this.subscribeToStoreSliceWithUser(STORE_SLICES.PROFILES);
    this.fetchMedia();
  }

  private fetchMedia() {
    this.mediaService.fetchOne(this.media_id).pipe(take(1)).subscribe((media) => {
      this.media = media;
      this.updateForm(media);
    });
  }

  public get media_id() {
    return this.route.snapshot.params.id;
  }

  public showFindUserDialog(): void {
    const dialogData: FindUserDialogData = {
      complete: user => this.tagProfile(user.id),
      users: this.foundUsers,
      searchUsers: queryString => this.searchUsers(queryString),
    };

    this.findUserDialogRef = this.dialog
      .open(FindUserDialogComponent, {
        width: '90%',
        maxWidth: 500,
        data: dialogData,
      });
  }

  private async searchUsers(queryString: string) {
    this.startLoading();

    this.foundUsers = await firstValueFrom(
      this.profileService.searchByNameOrEmail(queryString, 5))
      .finally(() => this.finishLoading());

    if (this.findUserDialogRef && this.findUserDialogRef.componentInstance) {
      this.findUserDialogRef.componentInstance.data = {
        ...this.findUserDialogRef.componentInstance.data,
        users: this.foundUsers,
      };
    }
  }

  public async deleteMedia(): Promise<void> {
    const fetcher = this.mediaService.delete(this.media_id);
    const deleted = await firstValueFrom(fetcher)
      .then(() => true)
      .catch((error) => this.dispatchError(`Failed to delete media: ${error.message}`))
      .finally(() => this.finishLoading());

    if (deleted) {
      this.dispatchMessage('Media deleted.');
      this.goTo([listMediaRoute.toString()]);
    }
  }

  private buildForm(): void {
    this.form = this.fb.group({
      pictures: this.fb.array([
        this.fb.group({
          description: this.fb.control(''),
          title: this.fb.control(''),
        })
      ])
    });
  }

  private updateForm(media: Media): void {
    const picturesForm = this.form.get('pictures') as UntypedFormArray;

    const pictureForm = picturesForm.at(0);

    pictureForm.patchValue(
      {
        description: media.description,
        title: media.title,
      });

    pictureForm.markAsPristine();
    this.form.updateValueAndValidity();
    this.form.markAsPristine();
  }

  public async saveForm(): Promise<void> {
    this.startLoading();

    const media: Partial<Media> = this.form.getRawValue().pictures[0];

    const fetcher = this.mediaService.updateOne(this.media_id, media);
    const saveMedia = await firstValueFrom(fetcher)
      .catch((error) => this.dispatchError(`Failed to save media: ${error.message}`))
      .finally(() => this.finishLoading());

    if (saveMedia) {
      this.dispatchMessage('Media saved.');
      this.updateForm(saveMedia);
    }
  }

  public async tagProfile(profile_id: string): Promise<boolean> {
    if (await super.tagProfile(profile_id, this.media_id)) {
      this.dispatchMessage('Media tagged.');
      this.fetchMedia();
      return true;
    }

    return false;
  }

  public async untagProfile(profile_id: string): Promise<boolean> {
    if (await super.untagProfile(profile_id, this.media_id)) {
      this.dispatchMessage('Deleted tag.');
      this.fetchMedia();
      return true;
    }

    return false;
  }

  public async tagSelf() {
    this.tagProfile(this.user.profile.id);
  }

  public async untagSelf() {
    this.untagProfile(this.user.profile.id);
  }

}
