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
import { MatDialog } from '@angular/material/dialog';
import { WindowService } from '../../../services/window.service';
import { MediaType } from '../../../../../../api/src/types/media/media-type';
import { FormBuilder, FormGroup, UntypedFormArray } from '@angular/forms';
import { listMediaRoute } from '../../../routes/routes';

@Component({
  selector: 'app-media-edit-page',
  styleUrls: ['./media-edit-page.component.scss'],
  templateUrl: './media-edit-page.component.html',
})
export class MediaEditPageComponent extends BasePageComponent implements OnInit, AfterViewInit {
  public media: Media;
  public width = 250;
  public height = 250;
  public MediaTypes = MediaType;
  public form: FormGroup;

  constructor(
    @Inject(Router) router: Router,
    @Inject(ActivatedRoute) route: ActivatedRoute,
    @Inject(Store) store: Store<any>,
    @Inject(MediaService) private mediaService: MediaService,
    @Inject(FormBuilder) private fb: FormBuilder,
    @Inject(MatDialog) dialog: MatDialog,
    @Inject(WindowService) public windowService: WindowService,
  ) {
    super(store, route, router, dialog);
  }

  ngOnInit() {
    this.buildForm();

    this.subscribeToStoreSliceWithUser(STORE_SLICES.PROFILES);
    this.mediaService.fetchOne(this.media_id).pipe(take(1)).subscribe((media) => {
      this.media = media;
      this.updateForm(media);
    });

  }

  public get media_id() {
    return this.route.snapshot.params.id;
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

}
