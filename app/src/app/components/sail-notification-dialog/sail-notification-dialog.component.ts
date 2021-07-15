import {
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';
import { SailNotificationDialogData } from '../../models/sail-notification-dialog-data.interface';

@Component({
  selector: 'app-sail-notification-dialog',
  templateUrl: './sail-notification-dialog.component.html',
  styleUrls: ['./sail-notification-dialog.component.css']
})
export class SailNotificationDialogComponent implements OnInit {

  public form: FormGroup;

  constructor(
    private fb: FormBuilder,
    @Inject(MatDialogRef) public dialogRef: MatDialogRef<SailNotificationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SailNotificationDialogData,
  ) { }

  ngOnInit() {
    this.form = this.fb.group({
      notificationType: this.fb.control(this.data.sail.calendarId ? 'update' : 'new', [Validators.required]),
      notificationMessage: this.fb.control(undefined),
    });
  }

  public sendAndClose(): void {
    const notificationMessage = this.form.value.notificationMessage;
    const notificationType = this.form.value.notificationType;

    this.data.sendSailNotification(notificationMessage, notificationType);
    this.dialogRef.close();
  }
}
