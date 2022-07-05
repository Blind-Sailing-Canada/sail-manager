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
import { Profile } from '../../../../../api/src/types/profile/profile';
import { LinkAccountsDialogData } from '../../models/link-accounts-dialog-data.interface';

@Component({
  selector: 'app-link-accounts-dialog',
  templateUrl: './link-accounts-dialog.component.html',
  styleUrls: ['./link-accounts-dialog.component.css']
})
export class LinkAccountsDialogComponent implements OnInit {

  public form: UntypedFormGroup;

  constructor(
    private fb: UntypedFormBuilder,
    @Inject(MatDialogRef) public dialogRef: MatDialogRef<LinkAccountsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: LinkAccountsDialogData,
  ) { }

  ngOnInit() {
    this.form = this.fb.group({
      linkType: this.fb.control('primary', [Validators.required]),
    });
  }

  public linkAndClose(profile: Profile): void {
    this.data.linkAccounts(this.data.account, profile, this.form.controls.linkType.value);
    this.dialogRef.close();
  }
}
