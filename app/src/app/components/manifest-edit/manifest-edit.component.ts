import {
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import {
  AbstractControl,
  UntypedFormArray,
  UntypedFormGroup,
} from '@angular/forms';
import { Profile } from '../../../../../api/src/types/profile/profile';
import { SailorRole } from '../../../../../api/src/types/sail-manifest/sailor-role';

@Component({
  selector: 'app-manifest-edit',
  templateUrl: './manifest-edit.component.html',
  styleUrls: ['./manifest-edit.component.scss']
})
export class ManifestEditComponent {

  @Input() form: UntypedFormGroup;
  @Input() manifestFormControlName: string;
  @Output() openProfileDialog: EventEmitter<Profile> = new EventEmitter<Profile>();

  public SAILOR_ROLE = SailorRole;

  public get manifestControls(): AbstractControl[] {
    return (this.form.get(this.manifestFormControlName) as UntypedFormArray).controls;
  }

  public showProfileDialog(profile: Profile): void {
    this.openProfileDialog.emit(profile);
  }

}
