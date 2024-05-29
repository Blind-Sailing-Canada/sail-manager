import { takeWhile } from 'rxjs/operators';
import {
  AfterViewInit,
  Component,
  OnDestroy,
} from '@angular/core';
import {
  MatDialog,
} from '@angular/material/dialog';
import {
  ActivatedRoute,
  Router,
} from '@angular/router';
import {
  Action,
  select,
  Store,
} from '@ngrx/store';
import { Sail } from '../../../../../api/src/types/sail/sail';
import { BoatDialogComponent } from '../../components/boat-dialog/boat-dialog.component';
import { ProfileDialogComponent } from '../../components/profile-dialog/profile-dialog.component';
import { AppState } from '../../models/app-state.interface';
import { BoatDialogData } from '../../models/boat-dialog-data.interface';
import { IBoatMaintenanceMap } from '../../models/boat-maintenance-state.interface';
import { IBoatMap } from '../../models/boat-state.interface';
import { ICDNState } from '../../models/cdn-state.interface';
import { ClinicsState } from '../../models/clinics.state';
import { FONT_SIZE } from '../../models/font-size';
import { ProfileDialogData } from '../../models/profile-dialog-data.interface';
import { IProfileMap } from '../../models/profile-state.interface';
import {
  ISailChecklistMap,
  ISailChecklistState,
} from '../../models/sail-checklist-state.interface';
import { ISailRequestState } from '../../models/sail-request-state.interface';
import { ISailMap } from '../../models/sail-state.interface';
import { SnackType } from '../../models/snack-state.interface';
import { User } from '../../models/user.interface';
import {
  viewBoatRoute,
  viewChallengeRoute,
  viewClinicRoute,
  viewDocumentRoute,
  viewProfileRoute,
  viewSailRequestRoute,
  viewSailRoute,
  viewSavedQueryRoute,
  viewSocialRoute,
} from '../../routes/routes';
import {
  finishChangingAppFont,
  finishLoading,
  startChangingAppFont,
  startLoading,
} from '../../store/actions/app.actions';
import {
  fetchBoatMaintenance,
  fetchBoatMaintenances,
} from '../../store/actions/boat-maintenance.actions';
import {
  fetchBoat,
  fetchBoats,
} from '../../store/actions/boat.actions';
import { Boat } from '../../../../../api/src/types/boat/boat';
import { BoatMaintenance } from '../../../../../api/src/types/boat-maintenance/boat-maintenance';
import { Clinic } from '../../../../../api/src/types/clinic/clinic';
import { Document } from '../../../../../api/src/types/document/document';
import { DocumentState } from '../../models/document.state';
import { Profile } from '../../../../../api/src/types/profile/profile';
import { ProfileRole } from '../../../../../api/src/types/profile/profile-role';
import { STORE_SLICES } from '../../store/store';
import { SailChecklist } from '../../../../../api/src/types/sail-checklist/sail-checklist';
import { SailRequest } from '../../../../../api/src/types/sail-request/sail-request';
import { fetchClinic } from '../../store/actions/clinic.actions';
import { fetchDocument } from '../../store/actions/document.actions';
import { fetchProfile } from '../../store/actions/profile.actions';
import { fetchSail, fetchSailByNumber } from '../../store/actions/sail.actions';
import { fetchSailChecklist } from '../../store/actions/sail-checklist.actions';
import { fetchSailRequest } from '../../store/actions/sail-request.actions';
import { putSnack } from '../../store/actions/snack.actions';
import { ChallengeState } from '../../models/challenge-state';
import { fetchChallenge } from '../../store/actions/challenge.actions';
import { Challenge } from '../../../../../api/src/types/challenge/challenge';
import { SocialState } from '../../models/social-state';
import { Social } from '../../../../../api/src/types/social/social';
import { fetchSocial } from '../../store/actions/social.actions';
import { Media } from '../../../../../api/src/types/media/media';
import { MediaDialogData } from '../../models/media-dialog-data.interface';
import { MediaDialogComponent } from '../../components/media-dialog/media-dialog.component';
import { MediaService } from '../../services/media.service';
import { MediaTagService } from '../../services/media-tag.service';
import { firstValueFrom } from 'rxjs';
import * as Sentry from '@sentry/browser';

@Component({
  template: ''
})
export class BasePageComponent implements OnDestroy, AfterViewInit {
  private static _isLoading: boolean;

  protected active = true;
  protected fetching = {};
  private storeData = {};

  constructor(
    private _store?: Store<any>,
    private activeRoute?: ActivatedRoute,
    private _router?: Router,
    public dialog?: MatDialog,
    public mediaService?: MediaService,
    public mediaTagService?: MediaTagService,
  ) {
    this.subscribeToStoreSlice(STORE_SLICES.APP);
    this.subscribeToStoreSlice(STORE_SLICES.LOGIN);
  }

  public get router(): Router {
    return this._router;
  }

  public get isUserAdmin(): boolean {
    if (!this.user) {
      return false;
    }

    return this.user.roles.includes(ProfileRole.Admin);
  }

  ngOnDestroy(): void {
    this.active = false;
  }

  ngAfterViewInit(): void {
    const appState: AppState = this.store[STORE_SLICES.APP];

    if (appState.fontSize !== 'default') {
      this.setFontSize(appState.fontSize);
    }

    setTimeout(
      () => {
        window.scrollTo(0, 0);
        const title = document.getElementById('pageTitle');
        if (title) {
          title.focus();
        }
      },
      200);
  }

  public dispatchMessage(message: string): void {
    this.dispatchAction(putSnack({ snack: { message, type: SnackType.INFO } }));
  }

  public dispatchError(message: string): void {
    this.dispatchAction(putSnack({ snack: { message, type: SnackType.ERROR } }));
    Sentry.captureException(message);
  }

  public goToEntity(entityType: string, entityId: string): void {
    switch(entityType) {
      case 'SailEntity':
        this.viewSail(entityId);
        break;
      case 'SocialEntity':
        this.viewSocial(entityId);
        break;
      case 'DocumentEntity':
        this.viewDocument(entityId);
        break;
      case 'BoatEntity':
        this.viewBoat(entityId);
        break;
      case 'ChallengeEntity':
        this.viewChallenge(entityId);
        break;
      case 'ClinicEntity':
        this.viewClinic(entityId);
        break;
      case 'SailRequestEntity':
        this.viewSailRequest(entityId);
        break;
      case 'SavedQueryEntity':
        this.viewSavedQuery(entityId);
        break;
    }
  }

  public picturesArray(picture: string): string[] {
    const array = (picture || '').split(',').map(url => url.trim());
    return array;
  }

  public get isLoading(): boolean {
    return BasePageComponent._isLoading;
  }

  public set isLoading(loading: boolean) {
    BasePageComponent._isLoading = loading;
  }

  public get loading(): boolean {
    return !!this.store[STORE_SLICES.APP].loading;
  }

  public startLoading(): void {
    this.dispatchAction(startLoading());
  }

  public finishLoading(): void {
    this.dispatchAction(finishLoading());
  }
  public get user(): User {
    const user = (this.store[STORE_SLICES.LOGIN] || {}).user;

    if (!user) {
      return null;
    }

    const tokenData = (this.store[STORE_SLICES.LOGIN] || {}).tokenData;

    return {
      profile: user,
      roles: user?.roles || [],
      access: tokenData?.access || {},
    };
  }

  public get boats(): IBoatMap {
    return this.store[STORE_SLICES.BOATS] || {} as IBoatMap;
  }

  public get challenges(): ChallengeState {
    return this.store[STORE_SLICES.CHALLENGES] || {} as ChallengeState;
  }


  public get boatsArray(): Boat[] {
    return Object.values(this.boats);
  }

  public get sailRequests(): ISailRequestState {
    return this.store[STORE_SLICES.SAIL_REQUESTS] || {} as ISailRequestState;
  }

  public getChecklist(sail_checklist_id: string): SailChecklist {
    const checklist = this.store[STORE_SLICES.CHECKLISTS].all[sail_checklist_id];

    if (checklist === undefined && !this.fetching[sail_checklist_id]) {
      this.fetching[sail_checklist_id] = true;
      this.dispatchAction(fetchSailChecklist({ sail_checklist_id }));
    }

    if (checklist && this.fetching[sail_checklist_id]) {
      delete this.fetching[sail_checklist_id];
    }

    return checklist;
  }

  public get sailChecklists(): ISailChecklistMap {
    const sailChecklistState = this.store[STORE_SLICES.CHECKLISTS] || {} as ISailChecklistState;
    return sailChecklistState.all;
  }

  public get cdn(): ICDNState {
    return this.store[STORE_SLICES.CDN] || {} as ICDNState;
  }

  public get maintenances(): IBoatMaintenanceMap {
    return this.store[STORE_SLICES.BOAT_MAINTENANCES] || {} as IBoatMaintenanceMap;
  }

  public get maintenancesArray(): BoatMaintenance[] {
    return Object.values(this.store[STORE_SLICES.BOAT_MAINTENANCES] || {}) as BoatMaintenance[];
  }

  public get profiles(): IProfileMap {
    return (this.store[STORE_SLICES.PROFILES] || {}).profiles || {} as IProfileMap;
  }

  public get clinics(): ClinicsState {
    return (this.store[STORE_SLICES.CLINICS] || {}) as ClinicsState;
  }

  public get documents(): DocumentState {
    return (this.store[STORE_SLICES.DOCUMENTS] || {}) as DocumentState;
  }

  public get profilesArray(): Profile[] {
    return Object.values<Profile>((this.store[STORE_SLICES.PROFILES] || {}).profiles || {} as IProfileMap).filter(profile => !!profile);
  }

  public get sails(): ISailMap {
    return (this.store[STORE_SLICES.SAILS] || {}).all || {} as ISailMap;
  }

  public get socials(): SocialState {
    return this.store[STORE_SLICES.SOCIALS];
  }

  public get sailsSearchResults(): Sail[] {
    return (this.store[STORE_SLICES.SAILS] || {}).search || [] as Sail[];
  }

  public getSail(id: string): Sail {
    const sail = this.sails[id];

    if (sail) {
      delete this.fetching[id];
    } else if (sail === undefined && !this.fetching[id]) {
      this.fetchSail(id);
    }

    return sail;
  }

  public getSailByNumber(sail_number: number): Sail {
    const sail = Object.values(this.sails).find(s => s.entity_number === sail_number);

    const key = `sail_${sail_number}`;

    if (sail) {
      delete this.fetching[key];
    } else if (sail === undefined && !this.fetching[key]) {
      this.fetchSailByNumber(sail_number);
    }

    return sail;
  }

  public getSocial(id: string): Social {
    const social = this.socials[id];

    if (social) {
      delete this.fetching[id];
    } else if (social === undefined && !this.fetching[id]) {
      this.fetchSocial(id);
    }

    return social;
  }


  public getChallenge(id: string): Challenge {
    const challenge = this.challenges[id];

    if (challenge) {
      delete this.fetching[id];
    } else if (challenge === undefined && !this.fetching[id]) {
      this.fetchChallenge(id);
    }

    return challenge;
  }

  public getSailRequest(id: string): SailRequest {
    const request = this.sailRequests[id];

    if (request) {
      delete this.fetching[id];
    } else if (request === undefined && !this.fetching[id]) {
      this.fetchSailRequest(id);
    }

    return request;
  }

  public getBoat(id: string): Boat {
    if (!id) {
      return;
    }

    if (this.boats[id] === undefined) {
      this.fetchBoat(id);
      return;
    }
    return this.boats[id];
  }

  public getClinic(id: string): Clinic {
    if (!id) {
      return;
    }

    if (this.clinics[id] === undefined) {
      this.fetchClinic(id);
      return;
    }
    return this.clinics[id];
  }

  public getDocument(id: string): Document {
    if (!id) {
      return;
    }

    if (this.documents[id] === undefined) {
      this.fetchDocument(id);
      return;
    }
    return this.documents[id];
  }

  public getProfile(id: string): Profile {
    if (!id) {
      return;
    }

    if (this.profiles[id] === undefined) {
      this.fetchProfile(id);
      return;
    }
    return this.profiles[id];
  }

  public fetchBoat(boat_id: string): void {
    if (!this.fetching[boat_id]) {
      this.fetching[boat_id] = true;
      this.dispatchAction(fetchBoat({ boat_id }));
    }
  }

  public fetchBoatMaintenances(query: string, notify?: boolean): void {
    this.dispatchAction(fetchBoatMaintenances({ query, notify }));
  }

  public fetchBoatMaintenance(boat_maintenance_id: string, notify?: boolean): void {
    if (this.fetching[boat_maintenance_id]) {
      return;
    }
    this.fetching[boat_maintenance_id] = true;
    this.dispatchAction(fetchBoatMaintenance({ boat_maintenance_id, notify }));
  }

  public fetchBoats(notify?: boolean): void {
    this.dispatchAction(fetchBoats({ notify }));
  }

  public showBoatDialog(boat: Boat, type?: string) {
    if (!boat) {
      return;
    }

    const dialogData: BoatDialogData = {
      boat,
      type,
      viewBoat: (id: string) => this.viewBoat(id),
    };

    this.dialog
      .open(BoatDialogComponent, {
        width: '90%',
        maxWidth: 500,
        data: dialogData,
      });
  }

  public showMediaDialog(media: Media, type?: string) {
    if (!media) {
      return;
    }

    const dialogData: MediaDialogData = {
      media,
      type,
      tag_me: this.mediaService ? () => this.tagProfile(this.user.profile.id, media.id) : null,
      untag_me: this.mediaService ? () => this.untagProfile(this.user.profile.id, media.id) : null,
    };

    this.dialog
      .open(MediaDialogComponent, {
        width: '90%',
        maxWidth: 500,
        data: dialogData,
      });
  }

  public showProfileDialog(profile: Profile, type?: string | ProfileRole[]) {
    if (!profile) {
      return;
    }

    const dialogData: ProfileDialogData = {
      profile,
      type,
      viewProfile: (id: string) => this.viewProfile(id),
    };

    return this.dialog
      .open(ProfileDialogComponent, {
        width: '90%',
        maxWidth: 500,
        data: dialogData,
      });
  }

  public viewSail(id: string): void {
    this.goTo([viewSailRoute(id)]);
  }

  public viewSocial(id: string): void {
    this.goTo([viewSocialRoute(id)]);
  }

  public viewDocument(id: string): void {
    this.goTo([viewDocumentRoute(id)]);
  }

  protected setFontSize(fontSize: string): void {
    if (!fontSize || fontSize === FONT_SIZE[FONT_SIZE.default]) {
      return;
    }

    const main: HTMLElement = document.getElementsByTagName('main')[0];

    if (!main) {
      return;
    }

    this.dispatchAction(startChangingAppFont());
    setTimeout(
      () => {
        this.setFontSizeRecursively(main, fontSize);
        this.dispatchAction(finishChangingAppFont());
      },
      500,
    );
  }

  protected get route() {
    return this.activeRoute;
  }

  protected get store() {
    return this.storeData as any;
  }

  protected goTo(data, options?) {
    return this.router.navigate(data, options);
  }

  protected copy(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  protected fetchProfile(profile_id: string): void {
    if (this.fetching[profile_id]) {
      return;
    }
    this.fetching[profile_id] = true;
    this.dispatchAction(fetchProfile({ profile_id }));
  }

  protected fetchClinic(id: string): void {
    if (this.fetching[id]) {
      return;
    }
    this.fetching[id] = true;
    this.dispatchAction(fetchClinic({ clinic_id: id }));
  }

  protected fetchDocument(document_id: string): void {
    if (this.fetching[document_id]) {
      return;
    }
    this.fetching[document_id] = true;
    this.dispatchAction(fetchDocument({ document_id }));
  }

  protected fetchSail(sail_id: string, options = {} as any): void {
    if (!this.fetching[sail_id]) {
      this.fetching[sail_id] = true;
      this.dispatchAction(fetchSail({ sail_id, ...options }));
    }
  }

  protected fetchSailByNumber(sail_number: number, options = {} as any): void {
    const key = `sail_${sail_number}`;

    if (!this.fetching[key]) {
      this.fetching[key] = true;
      this.dispatchAction(fetchSailByNumber({ sail_number, ...options }));
    }
  }

  protected fetchSocial(id: string, options = {} as any): void {
    if (!this.fetching[id]) {
      this.fetching[id] = true;
      this.dispatchAction(fetchSocial({ social_id: id, ...options }));
    }
  }

  protected fetchChallenge(challenge_id: string, options = {} as any): void {
    if (!this.fetching[challenge_id]) {
      this.fetching[challenge_id] = true;
      this.dispatchAction(fetchChallenge({ challenge_id, ...options }));
    }
  }

  protected fetchSailRequest(id: string, options = {} as any): void {
    if (!this.fetching[id]) {
      this.fetching[id] = true;
      this.dispatchAction(fetchSailRequest({ id, ...options }));
    }
  }

  protected subscribeToStoreSlice(slice, callback?: (data?: any) => void) {
    this.subscribeToStore(slice)
      .subscribe((data) => {
        this.storeData[slice] = this.copy(data);
        const ids = Object.keys(this.storeData[slice]);
        ids.forEach(id => delete this.fetching[id]);

        if (callback) {
          callback(this.storeData[slice]);
        }
      });
  }

  protected subscribeToStoreSliceWithUser(slice, callback?: (data?: any) => void) {
    this.subscribeToStoreWithUser(slice)
      .subscribe((data) => {
        this.storeData[slice] = this.copy(data);
        const ids = Object.keys(this.storeData[slice]);
        ids.forEach(id => delete this.fetching[id]);

        if (callback) {
          callback(this.storeData[slice]);
        }
      });
  }

  protected subscribeToStore(store: string) {
    return this._store
      .pipe(
        takeWhile(() => this.active),
        select(store)
      );
  }

  protected subscribeToStoreWithUser(store: string) {
    return this._store
      .pipe(
        takeWhile(() => this.active && !!this.user),
        select(store)
      );
  }

  protected dispatchAction(action: Action) {
    this._store.dispatch(action);
  }

  protected viewBoat(id: string): void {
    this.goTo([viewBoatRoute(id)]);
  }

  protected viewChallenge(id: string): void {
    this.goTo([viewChallengeRoute(id)]);
  }

  protected viewClinic(id: string): void {
    this.goTo([viewClinicRoute(id)]);
  }

  protected viewSailRequest(id: string): void {
    this.goTo([viewSailRequestRoute(id)]);
  }

  protected viewSavedQuery(id: string): void {
    this.goTo([viewSavedQueryRoute(id)]);
  }

  protected viewProfile(id: string): void {
    this.goTo([viewProfileRoute(id)]);
  }

  private setFontSizeRecursively(startFrom: HTMLElement, fontSize: string): void {
    startFrom
      .childNodes
      .forEach((element: HTMLElement) => {
        if (!element.style) {
          return;
        }

        const newSize = `font-size: ${fontSize} !important;`;
        element.style.cssText += `; ${newSize}`;

        this.setFontSizeRecursively(element, fontSize);
      });
  }

  public async tagProfile(profile_id: string, media_id: string): Promise<boolean>{
    const media: Media = await firstValueFrom(this.mediaService.fetchOne(media_id)).catch((error) => {
      this.dispatchMessage(error.error?.message || 'Failed to tag.');
      return null;
    });

    if (media?.tags.some(tag => tag.profile_id === profile_id)) {
      this.dispatchMessage('Already tagged.');
      return;
    }

    this.startLoading();

    const fetcher = this.mediaTagService.createOne({ media_id, profile_id });
    const createdTag = await firstValueFrom(fetcher)
      .catch((error) => this.dispatchError(`Failed to tag: ${error.message}`))
      .finally(() => this.finishLoading());

    if (createdTag) {
      this.dispatchMessage('Media tagged.');
    }

    return !!createdTag;
  }

  public async untagProfile(profile_id: string, media_id: string): Promise<boolean> {
    const media = await firstValueFrom(this.mediaService.fetchOne(media_id));
    const media_tag = media.tags.find((tag) => tag.profile_id === profile_id);

    if (!media_tag) {
      this.dispatchMessage('Already untagged.');
      return true;
    }

    this.startLoading();

    const fetcher = this.mediaTagService.delete(media_tag.id);
    const deleted = await firstValueFrom(fetcher)
      .then(() => true)
      .catch((error) => this.dispatchError(`Failed to delete tag: ${error.message}`))
      .finally(() => this.finishLoading());

    if (deleted) {
      this.dispatchMessage('Deleted tag.');
    }

    return !!deleted;
  }

}
