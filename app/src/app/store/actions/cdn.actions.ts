/* eslint-disable max-len */
import {
  createAction,
  props,
} from '@ngrx/store';

export enum Actions {
  DELETED_FILE = '[CDN] Deleted File',
  DELETE_ERROR = '[CDN] Delete Error',
  DELETE_FILE = '[CDN] Delete File',
  FINISH_UPLOADING = '[CDN] Finish Uploading',
  RESET = 'Reset',
  START_UPLOADING = '[CDN] Start Uploading',
  UPLOAD_ARRIVAL_INSTRUCTIONS_PICTURE = '[CDN] Upload arrival instructions picture',
  UPLOAD_BOAT_MAINTENANCE_PICTURE = '[CDN] Upload Boat Maintenance Picture',
  UPLOAD_BOAT_PICTURE = '[CDN] Upload Boat Picture',
  UPLOAD_CHALLENGE_PICTURE = '[CDN] Upload Challenge Picture',
  UPLOAD_DEPARTURE_INSTRUCTIONS_PICTURE = '[CDN] Upload departure instructions picture',
  UPLOAD_DOCUMENT = '[CDN] Upload Document',
  UPLOAD_ERROR = '[CDN] Upload Error',
  UPLOAD_MAINTENANCE_PICTURE = '[CDN] Upload Maintenance Picture',
  UPLOAD_PROFILE_PICTURE = '[CDN] Upload Profile Picture',
  UPLOAD_PROGRESS = '[CDN] Upload Progress',
  UPLOAD_SAIL_PICTURE = '[CDN] Upload Sail Picture',
  UPLOAD_SOCIAL_PICTURE = '[CDN] Upload Social Picture',
}

export enum CDN_ACTION_STATE {
  DELETED,
  ERROR,
  UPLOADED,
  UPLOADING,
}

export const deleteError = createAction(Actions.DELETE_ERROR, props<{ filePath: string; message: string; error?: Error }>());
export const deleteFile = createAction(Actions.DELETE_FILE, props<{ filePath: string; notify?: boolean }>());
export const deletedFile = createAction(Actions.DELETED_FILE, props<{ filePath: string }>());
export const finishUploading = createAction(Actions.FINISH_UPLOADING, props<{ fileName: string; url: string }>());
export const resetCDN = createAction(Actions.RESET, props<{ progress: number }>());
export const startUploading = createAction(Actions.START_UPLOADING, props<{ fileName: string }>());
export const uploadArrivalInstructionsPicture = createAction(Actions.UPLOAD_ARRIVAL_INSTRUCTIONS_PICTURE, props<{ file: File; boat_id: string; notify?: boolean }>());
export const uploadBoatMaintenancePicture = createAction(Actions.UPLOAD_BOAT_MAINTENANCE_PICTURE, props<{ file: File; boat_maintenance_id: string; notify?: boolean }>());
export const uploadBoatPicture = createAction(Actions.UPLOAD_BOAT_PICTURE, props<{ file: File; boat_id: string; notify?: boolean }>());
export const uploadChallengePicture = createAction(Actions.UPLOAD_CHALLENGE_PICTURE, props<{ file: File; challenge_id: string; notify?: boolean }>());
export const uploadDepartureInstructionsPicture = createAction(Actions.UPLOAD_DEPARTURE_INSTRUCTIONS_PICTURE, props<{ file: File; boat_id: string; notify?: boolean }>());
export const uploadDocument = createAction(Actions.UPLOAD_DOCUMENT, props<{ file: File; document_id: string; notify?: boolean }>());
export const uploadError = createAction(Actions.UPLOAD_ERROR, props<{ fileName: string; message: string; error?: Error }>());
export const uploadMaintenancePicture = createAction(Actions.UPLOAD_MAINTENANCE_PICTURE, props<{ file: File; notify?: boolean }>());
export const uploadProfilePicture = createAction(Actions.UPLOAD_PROFILE_PICTURE, props<{ file: File; profile_id: string; notify?: boolean }>());
export const uploadProgress = createAction(Actions.UPLOAD_PROGRESS, props<{ fileName: string; progress: number }>());
export const uploadSailPicture = createAction(Actions.UPLOAD_SAIL_PICTURE, props<{ file: File; sail_id: string; notify?: boolean }>());
export const uploadSocialPicture = createAction(Actions.UPLOAD_SOCIAL_PICTURE, props<{ file: File; social_id: string; notify?: boolean }>());
