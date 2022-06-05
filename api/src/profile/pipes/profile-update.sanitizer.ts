import {
  Injectable, PipeTransform
} from '@nestjs/common';
import { Profile } from '../../types/profile/profile';
import validator from 'validator';

@Injectable()
export class ProfileUpdateSanitizer implements PipeTransform {
  transform(value: Profile) {
    const {
      bio, email, name, phone, photo,
    } = value;
    const createDTO = {
      bio,
      email,
      name,
      phone,
      photo,
    };

    const keys = Object.keys(createDTO).filter(key => createDTO[key] !== undefined);

    return keys.reduce((profile, key) => {
      profile[key] =  validator.escape(createDTO[key] ?? '');
      return profile;
    }, {} as Profile);
  }
}
