import {
  createAction,
  props,
} from '@ngrx/store';

export enum CDN_ACTION_TYPES {
  DELETED_FILE = '[CDN] Deleted File',
  DELETE_ERROR = '[CDN] Delete Error',
  DELETE_FILE = '[CDN] Delete File',
  FINISH_UPLOADING = '[CDN] Finish Uploading',
  RESET = 'Reset',
  START_UPLOADING = '[CDN] Start Uploading',
  UPLOAD_ARRIVAL_INSTRUCTIONS_PICTURE = '[CDN] Upload arrival instructions picture',
  UPLOAD_BOAT_PICTURE = '[CDN] Upload Boat Picture',
  UPLOAD_CHALLENGE_PICTURE = '[CDN] Upload Challenge Picture',
  UPLOAD_DEPARTURE_INSTRUCTIONS_PICTURE = '[CDN] Upload departure instructions picture',
  UPLOAD_ERROR = '[CDN] Upload Error',
  UPLOAD_MAINTENANCE_PICTURE = '[CDN] Upload Maintenance Picture',
  UPLOAD_PROFILE_PICTURE = '[CDN] Upload Profile Picture',
  UPLOAD_PROGRESS = '[CDN] Upload Progress',
  UPLOAD_SAIL_PICTURE = '[CDN] Upload Sail Picture',
  UPLOAD_BOAT_MAINTENANCE_PICTURE = '[CDN] Upload Boat Maintenance Picture'
}

export enum CDN_ACTION_STATE {
  DELETED,
  ERROR,
  UPLOADED,
  UPLOADING,
}

export const finishUploading = createAction(CDN_ACTION_TYPES.FINISH_UPLOADING, props<{ fileName: string, url: string }>());
export const resetCDN = createAction(CDN_ACTION_TYPES.RESET, props<{ progress: number }>());
export const startUploading = createAction(CDN_ACTION_TYPES.START_UPLOADING, props<{ fileName: string }>());
export const uploadBoatPicture = createAction(
  CDN_ACTION_TYPES.UPLOAD_BOAT_PICTURE, props<{ file: File, boatId: string, notify?: boolean }>());
export const uploadMaintenancePicture = createAction(
  CDN_ACTION_TYPES.UPLOAD_MAINTENANCE_PICTURE, props<{ file: File, notify?: boolean }>());
export const uploadProfilePicture = createAction(
  CDN_ACTION_TYPES.UPLOAD_PROFILE_PICTURE, props<{ file: File, profileId: string, notify?: boolean }>());
export const uploadProgress = createAction(CDN_ACTION_TYPES.UPLOAD_PROGRESS, props<{ fileName: string, progress: number }>());
export const uploadError = createAction(CDN_ACTION_TYPES.UPLOAD_ERROR, props<{ fileName: string, message: string, error?: Error }>());
export const deleteError = createAction(CDN_ACTION_TYPES.DELETE_ERROR, props<{ filePath: string, message: string, error?: Error }>());
export const deleteFile = createAction(CDN_ACTION_TYPES.DELETE_FILE, props<{ filePath: string, notify?: boolean }>());
export const deletedFile = createAction(CDN_ACTION_TYPES.DELETED_FILE, props<{ filePath: string }>());
export const uploadDepartureInstructionsPicture = createAction(
  CDN_ACTION_TYPES.UPLOAD_DEPARTURE_INSTRUCTIONS_PICTURE, props<{ file: File, boatId: string, notify?: boolean }>());
export const uploadArrivalInstructionsPicture = createAction(
  CDN_ACTION_TYPES.UPLOAD_ARRIVAL_INSTRUCTIONS_PICTURE, props<{ file: File, boatId: string, notify?: boolean }>());
export const uploadSailPicture = createAction(
  CDN_ACTION_TYPES.UPLOAD_SAIL_PICTURE, props<{ file: File, sailId: string, notify?: boolean }>());
export const uploadChallengePicture = createAction(
  CDN_ACTION_TYPES.UPLOAD_CHALLENGE_PICTURE, props<{ file: File, challengeId: string, notify?: boolean }>());
export const uploadBoatMaintenancePicture = createAction(
  CDN_ACTION_TYPES.UPLOAD_BOAT_MAINTENANCE_PICTURE, props<{ file: File, maintenanceId: string, notify?: boolean }>());
