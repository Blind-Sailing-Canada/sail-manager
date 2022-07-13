import {
  Component,
  Inject,
} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';
import { MediaDialogData } from '../../models/media-dialog-data.interface';

@Component({
  selector: 'app-media-dialog',
  templateUrl: './media-dialog.component.html',
  styleUrls: ['./media-dialog.component.scss']
})
export class MediaDialogComponent {

  constructor(
    @Inject(MatDialogRef) public dialogRef: MatDialogRef<MediaDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: MediaDialogData,
  ) { }

  public close(): void {
    this.dialogRef.close();
  }

}
