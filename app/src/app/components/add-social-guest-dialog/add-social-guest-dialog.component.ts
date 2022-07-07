import {
  Component,
  Inject,
} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';
import { AddSocialGuestDialogData } from '../../models/add-social-guest-dialog-data.interface';

@Component({
  selector: 'app-add-social-guest-dialog',
  templateUrl: './add-social-guest-dialog.component.html',
  styleUrls: ['./add-social-guest-dialog.component.css']
})
export class AddSocialGuestDialogComponent {

  constructor(
    @Inject(MatDialogRef) public dialogRef: MatDialogRef<AddSocialGuestDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AddSocialGuestDialogData,
  ) { }

  public addAndClose(): void {
    this.data.addGuest(this.data.guestName, this.data.guest_of_id);
    this.dialogRef.close();
  }
}
