import {
  Component,
  Inject,
} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';
import { ChallengeCompleteDialogData } from '../../models/challenge-complete-dialog-data.interface';

@Component({
  selector: 'app-challenge-complete-dialog',
  templateUrl: './challenge-complete-dialog.component.html',
  styleUrls: ['./challenge-complete-dialog.component.scss']
})
export class ChallengeCompleteDialogComponent {

  constructor(
    @Inject(MatDialogRef) public dialogRef: MatDialogRef<ChallengeCompleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ChallengeCompleteDialogData,
  ) { }

  public submit(): void {
    this.close();
    this.data.submit(this.data.challenge.id, this.data.challenger.id, this.data.result);
  }

  public close(): void {
    this.dialogRef.close();
  }
}
