import {
  Component,
  Inject,
} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';
import { Profile } from '../../../../../api/src/types/profile/profile';
import { AddSailorDialogData } from '../../models/add-sailor-dialog-data.interface';

@Component({
  selector: 'app-add-sailor-dialog',
  templateUrl: './add-sailor-dialog.component.html',
  styleUrls: ['./add-sailor-dialog.component.css']
})
export class AddSailorDialogComponent {

  constructor(
    @Inject(MatDialogRef) public dialogRef: MatDialogRef<AddSailorDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AddSailorDialogData,
  ) { }

  public addAndClose(sailor: Profile): void {
    this.data.addSailor(sailor);
    this.dialogRef.close();
  }
}
