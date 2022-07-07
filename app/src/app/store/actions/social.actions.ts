import {
  createAction,
  props,
} from '@ngrx/store';
import { TypedAction } from '@ngrx/store/src/models';
import { Comment } from '../../../../../api/src/types/comment/comment';
import { Social } from '../../../../../api/src/types/social/social';

enum ACTIONS {
  CANCEL = '[Social] Cancel',
  COMPLETE = '[Social] Complete',
  CREATE = '[Social] Create',
  DELETE_COMMENT = '[Social] Delete Comment',
  FETCH_MANY = '[Social] Fetch Many',
  FETCH_ONE = '[Social] Fetch One',
  JOIN = '[Social] Join',
  LEAVE = '[Social] Leave',
  POST_COMMENT = '[Social] Post Comment',
  PUT_MANY = '[Social] Put Many',
  PUT_ONE = '[Social] Put One',
  RESET = 'Reset',
  SEND_NOTIFICATION = '[Social] Send Social Notification',
  UPDATE_ONE = '[Social] Update One',
}

export const sendSocialNotification = createAction(ACTIONS.SEND_NOTIFICATION,
  props<{ social_id: string; notificationType: string; notificationMessage: string; notify?: boolean }>(),
);
export const cancelSocial = createAction(ACTIONS.CANCEL, props<{ social_id: string; social: Social; notify?: boolean }>());
export const postSocialComment = createAction(ACTIONS.POST_COMMENT, props<{ social_id: string; comment: Comment; notify?: boolean }>());
export const deleteSocialComment
  = createAction(ACTIONS.DELETE_COMMENT, props<{ social_id: string; comment_id: string; notify?: boolean }>());
export const completeSocial = createAction(ACTIONS.COMPLETE, props<{ social: Social; notify?: boolean }>());
export const createSocial = createAction(ACTIONS.CREATE, props<{ social: Social }>());
export const fetchSocial = createAction(ACTIONS.FETCH_ONE, props<{ social_id: string; notify?: boolean }>());
export const fetchSocials = createAction(ACTIONS.FETCH_MANY, props<{ notify?: boolean; query?: string }>());
export const leaveSocial = createAction(ACTIONS.LEAVE, props<{ social_id: string; notify?: boolean }>());
export const joinSocial = createAction(ACTIONS.JOIN, props<{ social_id: string; notify?: boolean }>());
export const putSocial = createAction(ACTIONS.PUT_ONE, props<{ id: string; social: Social }>());
export const putSocials = createAction(ACTIONS.PUT_MANY, props<{ socials: Social[] }>());
export const resetSocials = createAction(ACTIONS.RESET);
export const updateSocial = createAction(ACTIONS.UPDATE_ONE, props<{ id: string; social: Social; updateActions?: TypedAction<any>[] }>());
