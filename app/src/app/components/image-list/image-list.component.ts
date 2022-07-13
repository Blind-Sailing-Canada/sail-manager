import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Media } from '../../../../../api/src/types/media/media';
import { MediaType } from '../../../../../api/src/types/media/media-type';
import { Profile } from '../../../../../api/src/types/profile/profile';
import { UserAccessFields } from '../../../../../api/src/types/user-access/user-access-fields';
import { IProfileMap } from '../../models/profile-state.interface';
import { User } from '../../models/user.interface';

@Component({
  selector: 'app-image-list',
  templateUrl: './image-list.component.html',
  styleUrls: ['./image-list.component.scss']
})
export class ImageListComponent implements OnChanges {

  @Input() allowDelete = false;
  @Input() height = 100;
  @Input() pictures: string[] | Media[] = [];
  @Input() profiles: IProfileMap;
  @Input() showAuthor = false;
  @Input() showEntity = false;
  @Input() user: User;
  @Input() width = 100;
  @Output() deleteClick: EventEmitter<Media> = new EventEmitter<Media>();
  @Output() goToProfile: EventEmitter<Profile> = new EventEmitter<Profile>();
  @Output() showMediaDialog: EventEmitter<Media> = new EventEmitter<Media>();
  @Output() goToEntity: EventEmitter<{ id: string; type: string }> = new EventEmitter();

  public MediaTypes = MediaType;
  public picturesArray: Media[] = [];
  public EntityLabels = {
    SailEntity: 'sail',
    SocialEntity: 'social',
  };

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.pictures && changes.pictures.previousValue !== changes.pictures.currentValue) {
      this.picturesArray = this.constructPicturesArray();
    }
  }

  public canDelete(picture: Media): boolean {
    if (!this.user) {
      return false;
    }

    return this.user.profile.id === picture.posted_by_id || this.user.access[UserAccessFields.DeletePictures];
  }

  private constructPicturesArray(): Media[] {
    if (!this.pictures || this.pictures.length === 0) {
      return [];
    }

    if (typeof this.pictures[0] === 'string') {
      return (this.pictures as string[])
        .map((picture) => ({ url: picture } as Media));
    }

    return this.pictures as Media[];
  }
}
