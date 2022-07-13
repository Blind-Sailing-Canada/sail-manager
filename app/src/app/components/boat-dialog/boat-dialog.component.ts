import {
  Component,
  Inject,
} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';
import { BoatDialogData } from '../../models/boat-dialog-data.interface';

@Component({
  selector: 'app-boat-dialog',
  templateUrl: './boat-dialog.component.html',
  styleUrls: ['./boat-dialog.component.scss']
})
export class BoatDialogComponent {

  constructor(
    @Inject(MatDialogRef) public dialogRef: MatDialogRef<BoatDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: BoatDialogData,
  ) { }

  public viewBoat(): void {
    this.close();
    this.data.viewBoat(this.data.boat.id);
  }

  public close(): void {
    this.dialogRef.close();
  }

  public picturesArray(picture: string): string[] {
    const array = (picture || '')
      .split(',')
      .map(url => url.trim());

    return array;
  }
}
