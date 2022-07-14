import {
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import {
  ActivatedRoute,
  Router,
} from '@angular/router';
import { Store } from '@ngrx/store';
import { Comment } from '../../../../../../api/src/types/comment/comment';
import { User } from '../../../models/user.interface';
import {
  cancelSocialRoute,
  editSocialRoute,
  viewSocialPicturesRoute,
} from '../../../routes/routes';
import { STORE_SLICES } from '../../../store/store';
import { BasePageComponent } from '../../base-page/base-page.component';
import { ProfileRole } from '../../../../../../api/src/types/profile/profile-role';
import { Social } from '../../../../../../api/src/types/social/social';
import {
  completeSocial,
  deleteSocialComment,
  joinSocial,
  leaveSocial,
  postSocialComment,
  sendSocialNotification,
} from '../../../store/actions/social.actions';
import { SocialStatus } from '../../../../../../api/src/types/social/social-status';
import { SocialNotificationDialogData } from '../../../models/social-notification-dialog-data.interface';
import { SocialNotificationDialogComponent } from '../../../components/social-notification-dialog/social-notification-dialog.component';

@Component({
  selector: 'app-social-view-page',
  styleUrls: ['./social-view-page.component.scss'],
  templateUrl: './social-view-page.component.html',
})
export class SocialViewPageComponent extends BasePageComponent implements OnInit {

  public social: Social;
  public socialNotificationDialogRef: MatDialogRef<SocialNotificationDialogComponent>;

  private social_id: string;

  constructor(
    @Inject(MatDialog) dialog: MatDialog,
    @Inject(ActivatedRoute) route: ActivatedRoute,
    @Inject(Router) router: Router,
    @Inject(Store) store: Store<any>,
  ) {
    super(store, route, router, dialog);
  }

  ngOnInit() {
    if (!this.user) {
      return;
    }

    this.social_id = this.route.snapshot.params.id;

    this.subscribeToStoreSliceWithUser(STORE_SLICES.SOCIALS, () => {
      this.social = this.getSocial(this.social_id);
    });
  }

  public get exceedingMaxOccupancy(): boolean {
    return this.social.max_attendants !== -1 && this.social.manifest?.length > this.social.max_attendants;
  }

  public showSocialNotificationDialog(): void {
    const dialogData: SocialNotificationDialogData = {
      sendSocialNotification: (notificationMessage, notificationType) => this.sendNotification(notificationMessage, notificationType),
      social: this.social,
    };

    this.socialNotificationDialogRef = this.dialog
      .open(SocialNotificationDialogComponent, {
        width: '90%',
        maxWidth: 500,
        data: dialogData,
      });
  }

  public postNewComment(comment: Comment): void {
    this.dispatchAction(postSocialComment({ comment, social_id: this.social_id, notify: true }));
  }

  public deleteComment(comment_id: string): void {
    this.dispatchAction(deleteSocialComment({ comment_id, social_id: this.social_id, notify: true }));
  }

  public socialPicturesPageLink(): string {
    return viewSocialPicturesRoute(this.social_id);
  }

  public get isSocialCancelled(): boolean {
    if (!this.social) {
      return false;
    }

    return this.social.status === SocialStatus.Cancelled;
  }

  public get canEditSocial(): boolean {
    const user = this.user;
    const roles: string[] = user.roles || [];
    const isAdminOrCoordinator = roles.some(role => [ProfileRole.Admin, ProfileRole.Coordinator].includes(role as ProfileRole));

    return isAdminOrCoordinator || this.user.access.createSocial || this.user.access.editSocial;
  }

  public get canCancelSocial(): boolean {

    if (this.social.status !== SocialStatus.New) {
      return false;
    }

    return this.canEditSocial;
  }

  public get isInPast() {
    const start = new Date(this.social.start_at);
    const now = new Date();
    const past = start.getTime() < now.getTime();

    return !!past;
  }

  public get canJoin(): boolean {
    if (this.isInPast) {
      return false;
    }

    if (this.isSocialFull) {
      return false;
    }


    if (this.social.status !== SocialStatus.New) {
      return false;
    }

    return !this.isUserInSocial(this.social, this.user);
  }

  public get canLeaveSocial(): boolean {
    if (this.isInPast) {
      return false;
    }

    const social = this.social;

    if (social.status !== SocialStatus.New) {
      return false;
    }

    const user = this.user;
    const can = this.isUserInSocial(social, user);

    return can;
  }

  public cancelSocialLink(): string {
    return cancelSocialRoute(this.social_id);
  }

  public get isSocialFull(): boolean {
    const social = this.social;

    return social.max_attendants !== -1 && social.manifest.length >= social.max_attendants;
  }

  public editSocialLink(id): string {
    return editSocialRoute(id);
  }

  public joinSocial(): void {
    this.dispatchAction(joinSocial({ social_id: this.social_id, notify: true }));
  }

  public leaveSocial(): void {
    this.dispatchAction(leaveSocial({ social_id: this.social_id, notify: true }));
  }

  public get canSendNotification(): boolean {
    if (this.user.roles.includes(ProfileRole.Admin)) {
      return true;
    }

    if (this.user.roles.includes(ProfileRole.Coordinator)) {
      return true;
    }

    if (this.user.access.editSocial) {
      return true;
    }

    if (this.user.access.createSocial) {
      return true;
    }

    return true;
  }

  public get canEndSocial(): boolean {
    const social = this.social;

    if (social.status !== SocialStatus.New) {
      return false;
    }

    return this.canEditSocial;
  }

  public endSocial(): void {
    this.dispatchAction(completeSocial({ social: this.social, notify: true }));
  }

  public sendNotification(notificationMessage, notificationType): void {
    this.dispatchAction(sendSocialNotification({ notificationMessage, notificationType, social_id: this.social_id, notify: true }));
  }

  private isUserInSocial(social: Social = {} as Social, user: User): boolean {
    let inSocial = false;

    inSocial = social.manifest.some(attendant => attendant.profile_id === user.profile.id);

    return inSocial;
  }

}
