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
  cancelSailRoute,
  editSailRoute,
  listFeedbackRoute,
  listSailPathsRoute,
  viewSailChecklistRoute,
  viewSailPicturesRoute,
} from '../../../routes/routes';
import {
  completeSail,
  deleteSailComment,
  joinSailAsCrew,
  joinSailAsPassenger,
  joinSailAsSkipper,
  leaveSail,
  postSailComment,
  sendSailNotification,
  startSail,
} from '../../../store/actions/sail.actions';
import { STORE_SLICES } from '../../../store/store';
import { BasePageComponent } from '../../base-page/base-page.component';
import { Sail } from '../../../../../../api/src/types/sail/sail';
import { SailStatus } from '../../../../../../api/src/types/sail/sail-status';
import { SailorRole } from '../../../../../../api/src/types/sail-manifest/sailor-role';
import { ProfileRole } from '../../../../../../api/src/types/profile/profile-role';
import { Profile } from '../../../../../../api/src/types/profile/profile';
import { SailManifest } from '../../../../../../api/src/types/sail-manifest/sail-manifest';
import { UserAccessFields } from '../../../../../../api/src/types/user-access/user-access-fields';
import { SailNotificationDialogComponent } from '../../../components/sail-notification-dialog/sail-notification-dialog.component';
import { SailNotificationDialogData } from '../../../models/sail-notification-dialog-data.interface';

@Component({
  selector: 'app-sail-view-page',
  styleUrls: ['./sail-view-page.component.css'],
  templateUrl: './sail-view-page.component.html',
})
export class SailViewPageComponent extends BasePageComponent implements OnInit {

  public passengerSpots: number[] = [];
  public sailPassengers: SailManifest[] = [];
  public sail: Sail;
  public sailNotificationDialogRef: MatDialogRef<SailNotificationDialogComponent>;

  private sail_id: string;

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

    this.sail_id = this.route.snapshot.params.id;
    this.subscribeToStoreSliceWithUser(STORE_SLICES.SAILS, () => {
      this.sail = this.getSail(this.sail_id);

      if (this.sail) {
        this.sailPassengers = this.sail
          .manifest
          .filter(sailor => sailor.sailor_role !== SailorRole.Skipper && sailor.sailor_role !== SailorRole.Crew)
          .map(sailor => sailor);
        this.passengerSpots = [].constructor(Math.max(this.sailPassengers.length, (this.sail.max_occupancy || 6) - 2));
      }

    });
  }

  public showSailNotificationDialog(): void {
    const dialogData: SailNotificationDialogData = {
      sendSailNotification: (notificationMessage, notificationType) => this.sendNotification(notificationMessage, notificationType),
      sail: this.sail,
    };

    this.sailNotificationDialogRef = this.dialog
      .open(SailNotificationDialogComponent, {
        width: '90%',
        maxWidth: 500,
        data: dialogData,
      });
  }

  public postNewComment(comment: Comment): void {
    this.dispatchAction(postSailComment({ comment, sail_id: this.sail_id, notify: true }));
  }

  public deleteComment(comment_id: string): void {
    this.dispatchAction(deleteSailComment({ comment_id, sail_id: this.sail_id, notify: true }));
  }

  public goToSailPicturesPage(): void {
    this.goTo([viewSailPicturesRoute(this.sail_id)]);
  }

  public get isSailCancelled(): boolean {
    if (!this.sail) {
      return false;
    }
    return this.sail.status === SailStatus.Cancelled;
  }
  public get viewSailChecklistRouteLink(): string {
    return viewSailChecklistRoute(this.sail.id);
  }

  public get canViewChecklist(): boolean {
    const sail = this.sail;
    const sailStatus = sail.status;

    return sailStatus === SailStatus.Started || sailStatus === SailStatus.Completed;
  }

  public get isUserSailSkipper(): boolean {
    if (!this.user) {
      return false;
    }

    const is = this.sail
      .manifest
      .some(sailor => sailor.profile_id === this.user.profile.id && sailor.sailor_role === SailorRole.Skipper);

    return is;
  }

  public get isUserSailCrew(): boolean {
    if (!this.user) {
      return false;
    }

    const is = this.sail
      .manifest
      .some(sailor => sailor.profile_id === this.user.profile.id && sailor.sailor_role === SailorRole.Crew);

    return is;
  }

  public get canViewFeedback(): boolean {
    const sail = this.sail;
    const sailStatus = sail.status;

    return sailStatus === SailStatus.Completed;
  }

  public get canViewSailPaths(): boolean {
    return true;
  }

  public get viewSailFeedbackRouteLink(): string {
    return listFeedbackRoute(this.sail_id);
  }

  public get viewSailPathsRouteLink(): string {
    return listSailPathsRoute(this.sail_id);
  }

  public get canEditSail(): boolean {
    const user = this.user;
    const roles: string[] = user.roles || [];
    const isSkipper = roles.includes(ProfileRole.Skipper) && this.isUserSailSkipper;

    return isSkipper || this.user.access[UserAccessFields.EditSail];
  }

  public get canCancelSail(): boolean {
    const sail = this.sail;

    if (sail.status !== SailStatus.New) {
      return false;
    }

    return this.canEditSail;
  }

  public get isInPast() {
    const sail = this.sail;
    const start = new Date(sail.start_at);
    const now = new Date();
    const past = start.getTime() < now.getTime();

    return !!past;
  }

  public get sailSkipper(): Profile {
    return this.sail.manifest.find(sailor => sailor.sailor_role === SailorRole.Skipper)?.profile;
  }

  public get sailCrew(): Profile {
    return this.sail.manifest.find(sailor => sailor.sailor_role === SailorRole.Crew)?.profile;
  }

  public get canJoinSail(): boolean {
    if (this.isInPast) {
      return false;
    }

    if (this.isSailFull) {
      return false;
    }

    const sail = this.sail;

    if (sail.status !== SailStatus.New) {
      return false;
    }

    return true;
  }

  public get canLeaveSail(): boolean {
    if (this.isInPast) {
      return false;
    }

    const sail = this.sail;

    if (sail.status !== SailStatus.New) {
      return false;
    }

    const user = this.user;
    const can = this.isUserInSail(sail, user);

    return can;
  }

  public get canJoinCrew(): boolean {
    if (this.isInPast) {
      return false;
    }

    const sail = this.sail;

    if (sail.status !== SailStatus.New) {
      return false;
    }

    if (sail.manifest.some(sailor => sailor.sailor_role === SailorRole.Crew)) {
      return false;
    }

    const user = this.user;

    if (this.isUserInSail(sail, user)) {
      return false;
    }

    const can = user.roles.includes(ProfileRole.Crew);

    return can;
  }

  public get canJoinSkipper(): boolean {
    if (this.isInPast) {
      return false;
    }

    const sail = this.sail;

    if (sail.status !== SailStatus.New) {
      return false;
    }

    if (sail.manifest.some(sailor => sailor.sailor_role === SailorRole.Skipper)) {
      return false;
    }

    const user = this.user;

    if (this.isUserInSail(sail, user)) {
      return false;
    }

    const can = user.roles.includes(ProfileRole.Skipper);

    return can;
  }

  public get canJoinPassenger(): boolean {
    if (this.isInPast) {
      return false;
    }

    if (this.isSailFull) {
      return false;
    }

    const sail = this.sail;

    if (sail.status !== SailStatus.New) {
      return false;
    }

    const user = this.user;

    if (this.isUserInSail(sail, user)) {
      return false;
    }

    return true;
  }

  public cancelSail(): void {
    this.goTo([cancelSailRoute(this.sail_id)]);
  }

  public get isSailFull(): boolean {
    const sail = this.sail;

    return sail.manifest.length >= sail.max_occupancy;
  }

  public editSailLink(id): string {
    return editSailRoute(id);
  }

  public joinSailAsCrew(): void {
    const sail = this.sail;

    this.dispatchAction(joinSailAsCrew({ sail_id: sail.id, notify: true }));
  }

  public joinSailAsPassenger(): void {
    const sail = this.sail;

    this.dispatchAction(joinSailAsPassenger({ sail_id: sail.id, notify: true }));
  }

  public joinSailAsSkipper(): void {
    const sail = this.sail;

    this.dispatchAction(joinSailAsSkipper({ sail_id: sail.id, notify: true }));
  }

  public leaveSail(): void {
    const sail = this.sail;

    this.dispatchAction(leaveSail({ sail_id: sail.id, notify: true }));
  }

  public getPassengers(sail: Sail): Profile[] {
    const passengers = sail
      .manifest
      .filter(sailor => sailor.sailor_role !== SailorRole.Crew && sailor.sailor_role !== SailorRole.Skipper)
      .map(sailor => sailor.profile);

    return passengers;
  }

  public getPassengerNames(sail: Sail): string[] {
    const passengers = this.getPassengers(sail) || [];
    const names = passengers.map(passenger => passenger.name);

    return names;
  }

  public getPassengerLabel(spot: number): string {
    const passenger = this.sailPassengers[spot];

    if (passenger && passenger.profile) {
      return `${passenger.profile.name}. Click to open profile dialog.`;
    }

    if (passenger && passenger.guest_of) {
      return `${passenger.person_name} (Guest of ${passenger.guest_of.name}).`;
    }

    if (passenger) {
      return passenger.person_name;
    }

    return '-empty-';
  }

  public get canSendNotification(): boolean {
    const sail = this.sail;

    if (this.user.roles.includes(ProfileRole.Admin)) {
      return true;
    }

    if (this.user.roles.includes(ProfileRole.Coordinator)) {
      return true;
    }

    if (this.user.access[UserAccessFields.EditSail]) {
      return true;
    }

    if (!sail
      .manifest
      .find(sailor => sailor.profile_id === this.user.profile.id && sailor.sailor_role === SailorRole.Skipper)) {
      return false;
    }

    return true;
  }

  public get canStartSail(): boolean {
    const sail = this.sail;

    if (sail.status !== SailStatus.New) {
      return false;
    }

    if (!sail.manifest.some(sailor => sailor.sailor_role === SailorRole.Skipper)) {
      return false;
    }

    if (!sail.manifest.some(sailor => sailor.sailor_role === SailorRole.Crew)) {
      return false;
    }

    if (!sail.boat) {
      return false;
    }

    const start = new Date(sail.start_at).getTime();
    const now = new Date().getTime();
    const timeToStart = start - now;

    if (timeToStart > 1000 * 60 * 60) {
      return false;
    }

    const user = this.user;

    const roles: string[] = user.roles || [];
    const isSkipperOrCrew = roles.some(role => role === ProfileRole.Skipper || role === ProfileRole.Crew);

    if (isSkipperOrCrew && (this.isUserSailSkipper || this.isUserSailCrew)) {
      return true;
    }

    return false;
  }

  public get canEndSail(): boolean {
    const sail = this.sail;

    if (sail.status !== SailStatus.Started) {
      return false;
    }

    const user = this.user;

    const roles: string[] = user.roles || [];
    const isSkipperOrCrew = roles.some(role => role === ProfileRole.Skipper || role === ProfileRole.Crew);

    if (isSkipperOrCrew && (this.isUserSailSkipper || this.isUserSailCrew)) {
      return true;
    }

    return false;
  }

  public startSail(): void {
    this.dispatchAction(startSail({ sail: this.sail, notify: true }));
  }

  public endSail(): void {
    this.dispatchAction(completeSail({ sail: this.sail, notify: true }));
  }

  private sendNotification(notificationMessage, notificationType): void {
    this.dispatchAction(sendSailNotification({ notificationMessage, notificationType, sail_id: this.sail_id, notify: true }));
  }

  private isUserInSail(sail: Sail = {} as Sail, user: User): boolean {
    let inSail = false;

    inSail = sail.manifest.some(sailor => sailor.profile_id === user.profile.id);

    return inSail;
  }

}
