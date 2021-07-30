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
import { CreateUserDialogData } from '../../models/create-user-dialog-data.interface';

@Component({
  selector: 'app-create-user-dialog',
  templateUrl: './create-user-dialog.component.html',
  styleUrls: ['./create-user-dialog.component.css']
})
export class CreateUserDialogComponent implements OnInit {

  public form: FormGroup;

  constructor(
    private fb: FormBuilder,
    @Inject(MatDialogRef) public dialogRef: MatDialogRef<CreateUserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CreateUserDialogData,
  ) { }

  ngOnInit() {
    this.form = this.fb.group({
      name: this.fb.control('', [Validators.required]),
      email: this.fb.control('', [Validators.required]),
      error: this.fb.control('')
    });
  }

  public createAndClose(): void {
    this.data.createUser(this.form.controls.name.value, this.form.controls.email.value)
      .then(() => this.dialogRef.close())
      .catch((error) => {
        console.error(error);
        this.form.patchValue({ error: error.message });
      });
  }
}
