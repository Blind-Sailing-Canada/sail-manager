import { takeWhile } from 'rxjs/operators';
import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnDestroy,
  Output,
} from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
} from '@angular/forms';
import {
  Comment
} from '../../../../../api/src/types/comment/comment';
import { User } from '../../models/user.interface';

@Component({
  selector: 'app-new-comment-form',
  templateUrl: './new-comment-form.component.html',
  styleUrls: ['./new-comment-form.component.css']
})
export class NewCommentFormComponent implements OnDestroy {

  @Input() currentUser: User;
  @Output() postNewComment: EventEmitter<Comment> = new EventEmitter<Comment>();
  public form: UntypedFormGroup;

  private active = true;

  constructor(@Inject(UntypedFormBuilder) private fb: UntypedFormBuilder) {
    this.buildForm();
  }

  ngOnDestroy() {
    this.active = false;
  }

  public get shouldEnableCommentButton(): boolean {
    return this.form && this.form.valid && this.form.dirty;
  }

  public addNewComment(): void {
    if (!this.form || !this.form.valid || !this.form.dirty) {
      return;
    }

    const comment = {
      comment: this.form.controls.comment.value.trim(),
    } as Comment;

    this.postNewComment.emit(comment);

    this.form.reset();
  }

  private buildForm() {
    this.form = this.fb.group({
      comment: this.fb.control(undefined)
    });

    this.form
      .controls
      .comment
      .valueChanges
      .pipe(
        takeWhile(() => this.active),
      )
      .subscribe((data) => {
        if (!data || !data.trim()) {
          this.form.markAsPristine();
        }
      });
  }

}
