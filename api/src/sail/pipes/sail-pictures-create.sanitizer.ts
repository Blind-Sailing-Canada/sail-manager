import {
  Injectable, PipeTransform
} from '@nestjs/common';
import { Media } from '../../types/media/media';
import validator from 'validator';

@Injectable()
export class SailPicturesCreateSanitizer implements PipeTransform {
  transform(pictures: Media[]): Partial<Media>[] {
    if (!pictures?.length) {
      return [] as Partial<Media>[];
    }

    const result = pictures.map(picture => {
      const {
        url,
        title,
        description,
        media_type,
      } = picture;
      const createDTO = {
        url,
        title,
        description,
        media_type,
      };

      const keys = Object.keys(createDTO).filter(key => createDTO[key] !== undefined);

      return keys.reduce((profile, key) => {
        profile[key] = key == 'url'? createDTO[key]: validator.escape(createDTO[key] ?? '');
        return profile;
      }, {} as Partial<Media>);
    });

    return result;
  }

}
