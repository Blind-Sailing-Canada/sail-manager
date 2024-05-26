import {
  Component,
  Inject,
} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';
import { AddGroupMemberDialogData } from '../../models/add-group-member-dialog-data';

@Component({
  selector: 'app-add-group-member-dialog',
  templateUrl: './add-group-member-dialog.component.html',
  styleUrls: ['./add-group-member-dialog.component.scss']
})
export class AddGroupMemberDialogComponent {

  constructor(
    @Inject(MatDialogRef) public dialogRef: MatDialogRef<AddGroupMemberDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AddGroupMemberDialogData,
  ) { }

  public addAndClose(): void {
    this.data.addMember(this.data.group, this.data.memberEmail.trim().toLowerCase());
    this.dialogRef.close();
  }

  public get isFormValid(): boolean {
    let valid = !!this.data.memberEmail?.trim();
    valid = valid && /.{1,}@.{1,}\..{1,}/g.test(this.data.memberEmail.trim());
    valid = valid && this.data.memberEmail.includes('.');

    return valid;
  }
}
