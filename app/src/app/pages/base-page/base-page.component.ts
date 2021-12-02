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
import { IAppState } from '../../models/app-state.interface';
import { BoatDialogData } from '../../models/boat-dialog-data.interface';
import { IBoatMaintenanceMap } from '../../models/boat-maintenance-state.interface';
import { IBoatMap } from '../../models/boat-state.interface';
import { ICDNState } from '../../models/cdn-state.interface';
import { ClinicsState } from '../../models/clinics.state';
import { FONT_SIZE } from '../../models/font-size';
// import {
//   InstructionsMap,
//   InstructionsState,
// } from '../../models/instructions-state.interface';
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
  viewProfileRoute,
  viewSailRoute,
} from '../../routes/routes';
import {
  finishChangingAppFont,
  startChangingAppFont,
} from '../../store/actions/app.actions';
import {
  fetchBoatMaintenance,
  fetchBoatMaintenances,
} from '../../store/actions/boat-maintenance.actions';
import {
  fetchBoat,
  fetchBoats,
} from '../../store/actions/boat.actions';
import { fetchClinic } from '../../store/actions/clinic.actions';
import { fetchProfile } from '../../store/actions/profile.actions';
import { fetchSailChecklist } from '../../store/actions/sail-checklist.actions';
import { fetchSailRequest } from '../../store/actions/sail-request.actions';
import { fetchSail } from '../../store/actions/sail.actions';
import { putSnack } from '../../store/actions/snack.actions';
import { STORE_SLICES } from '../../store/store';
import { Boat } from '../../../../../api/src/types/boat/boat';
import { SailChecklist } from '../../../../../api/src/types/sail-checklist/sail-checklist';
import { Profile } from '../../../../../api/src/types/profile/profile';
import { BoatMaintenance } from '../../../../../api/src/types/boat-maintenance/boat-maintenance';
import { SailRequest } from '../../../../../api/src/types/sail-request/sail-request';
import { Clinic } from '../../../../../api/src/types/clinic/clinic';
import { ProfileRole } from '../../../../../api/src/types/profile/profile-role';

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
  ) {
    this.subscribeToStoreSlice(STORE_SLICES.APP);
    this.subscribeToStoreSlice(STORE_SLICES.LOGIN);
  }

  public get router(): Router {
    return this._router;
  }

  ngOnDestroy(): void {
    this.active = false;
  }

  ngAfterViewInit(): void {
    const appState: IAppState = this.store[STORE_SLICES.APP];

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

  public get user(): User {
    const user = (this.store[STORE_SLICES.LOGIN] || {}).user;

    if (!user) {
      return null;
    }

    const tokenData = (this.store[STORE_SLICES.LOGIN] || {}).tokenData;

    return {
      profile: user,
      roles: (user || {}).roles,
      access: ((tokenData || {}).access || {}).access || {},
    };
  }

  public get boats(): IBoatMap {
    return this.store[STORE_SLICES.BOATS] || {} as IBoatMap;
  }

  public get boatsArray(): Boat[] {
    return Object.values(this.boats);
  }

  public get sailRequests(): ISailRequestState {
    return this.store[STORE_SLICES.SAIL_REQUESTS] || {} as ISailRequestState;
  }

  public getChecklist(id: string): SailChecklist {
    const checklist = this.store[STORE_SLICES.CHECKLISTS].all[id];

    if (checklist === undefined && !this.fetching[id]) {
      this.fetching[id] = true;
      this.dispatchAction(fetchSailChecklist({ id }));
    }

    if (checklist && this.fetching[id]) {
      delete this.fetching[id];
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

  public get profilesArray(): Profile[] {
    return Object.values<Profile>((this.store[STORE_SLICES.PROFILES] || {}).profiles || {} as IProfileMap).filter(profile => !!profile);
  }

  public get sails(): ISailMap {
    return (this.store[STORE_SLICES.SAILS] || {}).all || {} as ISailMap;
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

  public fetchBoat(id: string): void {
    if (!this.fetching[id]) {
      this.fetching[id] = true;
      this.dispatchAction(fetchBoat({ id }));
    }
  }

  public fetchBoatMaintenances(query: string, notify?: boolean): void {
    this.dispatchAction(fetchBoatMaintenances({ query, notify }));
  }

  public fetchBoatMaintenance(id: string, notify?: boolean): void {
    if (this.fetching[id]) {
      return;
    }
    this.fetching[id] = true;
    this.dispatchAction(fetchBoatMaintenance({ id, notify }));
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
        this.setFontSizeRecursivly(main, fontSize);
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

  protected fetchProfile(id: string): void {
    if (this.fetching[id]) {
      return;
    }
    this.fetching[id] = true;
    this.dispatchAction(fetchProfile({ id }));
  }

  protected fetchClinic(id: string): void {
    if (this.fetching[id]) {
      return;
    }
    this.fetching[id] = true;
    this.dispatchAction(fetchClinic({ clinicId: id }));
  }

  protected fetchSail(id: string, options = {} as any): void {
    if (!this.fetching[id]) {
      this.fetching[id] = true;
      this.dispatchAction(fetchSail({ id, ...options }));
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

  protected viewProfile(id: string): void {
    this.goTo([viewProfileRoute(id)]);
  }

  private setFontSizeRecursivly(startFrom: HTMLElement, fontSize: string): void {
    startFrom
      .childNodes
      .forEach((element: HTMLElement) => {
        if (!element.style) {
          return;
        }

        const newSize = `font-size: ${fontSize} !important;`;
        element.style.cssText += `; ${newSize}`;

        this.setFontSizeRecursivly(element, fontSize);
      });
  }

}
