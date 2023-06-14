import {
  Component,
  Inject,
} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';
import { AddGuestDialogData } from '../../models/add-guest-dialog-data.interface';

@Component({
  selector: 'app-add-guest-dialog',
  templateUrl: './add-guest-dialog.component.html',
  styleUrls: ['./add-guest-dialog.component.scss']
})
export class AddGuestDialogComponent {

  constructor(
    @Inject(MatDialogRef) public dialogRef: MatDialogRef<AddGuestDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AddGuestDialogData,
  ) { }

  public addAndClose(): void {
    this.data.addGuest(this.data.guestName?.trim(), this.data.guest_email?.trim(), this.data.guest_of_id);
    this.dialogRef.close();
  }

  public get isFormValid(): boolean {
    let valid = !!this.data.guestName?.trim();
    valid = valid && !!this.data.guest_email?.trim();
    valid = valid && !!this.data.guest_of_id;
    valid = valid && /.{1,}@.{1,}\..{1,}/g.test(this.data.guest_email.trim());
    valid = valid && this.data.guest_email.includes('.');

    return valid;
  }
}
