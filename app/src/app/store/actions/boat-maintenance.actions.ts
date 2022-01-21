import {
  createAction,
  props,
} from '@ngrx/store';
import { Comment } from '../../../../../api/src/types/comment/comment';
import { BoatMaintenance } from '../../../../../api/src/types/boat-maintenance/boat-maintenance';
import { Media } from '../../../../../api/src/types/media/media';

export enum BOAT_MAINTENANCE_ACTION_TYPES {
  CREATE = '[Boat Maintenance] Create',
  DELETE_COMMENT = '[Boat Maintenance] Delete Comment',
  FETCH_MANY = '[Boat Maintenance] Fetch Many',
  FETCH_ONE = '[Boat Maintenance] Fetch One',
  POST_COMMENT = '[Boat Maintenance] Post Comment',
  POST_PICTURES = '[Boat Maintenance] Post Picture',
  DELETE_PICTURE = '[Boat Maintenance] Delete Picture',
  PUT_MANY = '[Boat Maintenance] Put Many',
  PUT_ONE = '[Boat Maintenance] Put One',
  RESET = 'Reset',
  UPDATE = '[Boat Maintenance] Update',
}

export const createBoatMaintenance = createAction(
  BOAT_MAINTENANCE_ACTION_TYPES.CREATE, props<{ maintenance: Partial<BoatMaintenance>; notify?: boolean }>());
export const updateBoatMaintenance = createAction(
  BOAT_MAINTENANCE_ACTION_TYPES.UPDATE, props<{ boat_maintenance_id: string; maintenance: Partial<BoatMaintenance>; notify?: boolean }>());
export const fetchBoatMaintenances = createAction(BOAT_MAINTENANCE_ACTION_TYPES.FETCH_MANY, props<{ query: string; notify?: boolean }>());
export const fetchBoatMaintenance = createAction(
  BOAT_MAINTENANCE_ACTION_TYPES.FETCH_ONE, props<{ boat_maintenance_id: string; notify?: boolean }>());
export const postBoatMaintenanceComment = createAction(
  BOAT_MAINTENANCE_ACTION_TYPES.POST_COMMENT, props<{ boat_maintenance_id: string; comment: Comment; notify?: boolean }>());
export const putBoatMaintenances = createAction(
  BOAT_MAINTENANCE_ACTION_TYPES.PUT_MANY, props<{ maintenances: Partial<BoatMaintenance>[] }>());
export const putBoatMaintenance = createAction(
  BOAT_MAINTENANCE_ACTION_TYPES.PUT_ONE, props<{ boat_maintenance_id: string; maintenance: Partial<BoatMaintenance> }>());
export const resetBoatMaintenances = createAction(BOAT_MAINTENANCE_ACTION_TYPES.RESET);
export const deleteBoatMaintenanceComment = createAction(
  BOAT_MAINTENANCE_ACTION_TYPES.DELETE_COMMENT, props<{ boat_maintenance_id: string; comment_id: string; notify?: boolean }>());
export const deleteBoatMaintenancePicture = createAction(
    BOAT_MAINTENANCE_ACTION_TYPES.DELETE_PICTURE, props<{ boat_maintenance_id: string; picture_id: string; notify?: boolean }>());
export const postBoatMaintenancePictures = createAction(
  BOAT_MAINTENANCE_ACTION_TYPES.POST_PICTURES, props<{ boat_maintenance_id: string; pictures: Partial<Media>[]; notify?: boolean }>());
