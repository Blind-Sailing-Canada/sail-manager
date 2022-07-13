import {
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';
import { SocialNotificationDialogData } from '../../models/social-notification-dialog-data.interface';

@Component({
  selector: 'app-social-notification-dialog',
  templateUrl: './social-notification-dialog.component.html',
  styleUrls: ['./social-notification-dialog.component.scss']
})
export class SocialNotificationDialogComponent implements OnInit {

  public form: UntypedFormGroup;

  constructor(
    private fb: UntypedFormBuilder,
    @Inject(MatDialogRef) public dialogRef: MatDialogRef<SocialNotificationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SocialNotificationDialogData,
  ) { }

  ngOnInit() {
    this.form = this.fb.group({
      notificationType: this.fb.control(this.data.social.calendar_id ? 'update' : 'new', [Validators.required]),
      notificationMessage: this.fb.control(undefined),
    });
  }

  public sendAndClose(): void {
    const notificationMessage = this.form.value.notificationMessage;
    const notificationType = this.form.value.notificationType;

    this.data.sendSocialNotification(notificationMessage, notificationType);
    this.dialogRef.close();
  }
}
