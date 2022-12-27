import {
  Component,
  Inject,
} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';
import { Profile } from '../../../../../api/src/types/profile/profile';
import { FindUserDialogData } from '../../models/find-user-dialog-data.interface';

@Component({
  selector: 'app-find-user-dialog',
  templateUrl: './find-user-dialog.component.html',
  styleUrls: ['./find-user-dialog.component.scss']
})
export class FindUserDialogComponent {

  constructor(
    @Inject(MatDialogRef) public dialogRef: MatDialogRef<FindUserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: FindUserDialogData,
  ) { }

  public completeAndClose(user: Profile): void {
    this.data.complete(user);
    this.dialogRef.close();
  }
}
