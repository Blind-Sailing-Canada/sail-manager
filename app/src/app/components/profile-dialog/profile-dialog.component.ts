import {
  Component,
  Inject,
} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';
import { ProfileDialogData } from '../../models/profile-dialog-data.interface';

@Component({
  selector: 'app-profile-dialog',
  templateUrl: './profile-dialog.component.html',
  styleUrls: ['./profile-dialog.component.css']
})
export class ProfileDialogComponent {

  constructor(
    @Inject(MatDialogRef) public dialogRef: MatDialogRef<ProfileDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ProfileDialogData,
  ) { }

  public viewProfile(): void {
    this.close();
    this.data.viewProfile(this.data.profile.id);
  }

  public close(): void {
    this.dialogRef.close();
  }
}
