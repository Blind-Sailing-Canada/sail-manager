import {
  Component,
  Inject,
} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';
import { Profile } from '../../../../../api/src/types/profile/profile';
import { AddSocialAttendantDialogData } from '../../models/add-social-attendant-dialog-data.interface';

@Component({
  selector: 'app-add-social-attendant-dialog',
  templateUrl: './add-social-attendant-dialog.component.html',
  styleUrls: ['./add-social-attendant-dialog.component.scss']
})
export class AddSocialAttendantDialogComponent {

  constructor(
    @Inject(MatDialogRef) public dialogRef: MatDialogRef<AddSocialAttendantDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AddSocialAttendantDialogData,
  ) { }

  public addAndClose(profile: Profile): void {
    this.data.addAttendant(profile);
    this.dialogRef.close();
  }
}
