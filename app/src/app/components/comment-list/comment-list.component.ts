import {
  Component,
  EventEmitter,
  Inject,
  Input,
  Output,
} from '@angular/core';
import {
  Comment,
} from '../../../../../api/src/types/comment/comment';
import { Profile } from '../../../../../api/src/types/profile/profile';
import { MomentService } from '../../services/moment.service';
import { User } from '../../models/user.interface';
import { ProfileRole } from '../../../../../api/src/types/profile/profile-role';
import { UserAccessFields } from '../../../../../api/src/types/user-access/user-access-fields';
@Component({
  selector: 'app-comment-list',
  templateUrl: './comment-list.component.html',
  styleUrls: ['./comment-list.component.css']
})
export class CommentListComponent {

  @Input() comments: Comment[];
  @Input() user: User;
  @Output() profileClick: EventEmitter<Profile> = new EventEmitter<Profile>();
  @Output() commentDelete: EventEmitter<string> = new EventEmitter<string>();

  constructor(@Inject(MomentService) private momentService: MomentService) { }

  public clickProfile(profile: Profile): void {
    this.profileClick.emit(profile);
  }

  public deleteComment(comment_id: string): void {
    this.commentDelete.emit(comment_id);
  }

  public canDeleteComment(comment: Comment): boolean {
    if (this.user.roles.includes(ProfileRole.Admin)) {
      return true;
    }

    if (this.user.access[UserAccessFields.CreateChallenge]) {
      return true;
    }

    if (this.user.access[UserAccessFields.EditChallenge]) {
      return true;
    }

    return comment.author_id === this.user.profile.id;
  }

  public generateCommentAriaLabel(index: number, comment: Comment): string {
    const author: Profile = comment.author;
    const date = this.momentService.humanizeDateWithTime(comment.created_at, false);
    const text = comment.comment;

    const label = `
      Comment ${index + 1} of ${this.comments.length}.
      Posted by: ${author.name},
      Posted: ${date}.
      Text: ${text}.
    `;

    return label;
  }
}
