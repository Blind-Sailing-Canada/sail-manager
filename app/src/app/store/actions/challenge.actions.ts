import {
  createAction,
  props,
} from '@ngrx/store';
import { Challenge } from '../../../../../api/src/types/challenge/challenge';
import { Comment } from '../../../../../api/src/types/comment/comment';
import { Media } from '../../../../../api/src/types/media/media';

export enum CHALLENGE_ACTION_TYPES {
  COMPLETE_USER_CHALLENGE = '[Challenge] Complete user challenge',
  CREATE_CHALLENGE = '[Challenge] Create challenge',
  DELETE_COMMENT = '[Challenge] Delete comment',
  DELETE_PICTURE = '[Challenge] Delete challenge picture',
  FETCH_CHALLENGE = '[Challenge] Fetch challenge',
  FETCH_CHALLENGES = '[Challenge] Fetch challenges',
  JOIN_CHALLENGE = '[Challenge] Join challenge',
  LEAVE_CHALLENGE = '[Challenge] Leave challenge',
  POST_COMMENT = '[Challenge] Post challenge comment',
  POST_PICTURES = '[Challenge] Post challenge pictures',
  PUT_CHALLENGE = '[Challenge] Put challenge',
  PUT_CHALLENGES = '[Challenge] Put challenges',
  RESET = 'Reset',
  UPDATE_CHALLENGE = '[Challenge] Update challenge',
}

export const completeUserChallenge = createAction(
  CHALLENGE_ACTION_TYPES.COMPLETE_USER_CHALLENGE, props<{ challenge_id: string; challengerId: string; note?: string; notify?: boolean }>());
export const joinChallenge = createAction(
  CHALLENGE_ACTION_TYPES.JOIN_CHALLENGE, props<{ challenge_id: string; notify?: boolean }>());
export const leaveChallenge = createAction(
  CHALLENGE_ACTION_TYPES.LEAVE_CHALLENGE, props<{ challenge_id: string; notify?: boolean }>());
export const createChallenge = createAction(
  CHALLENGE_ACTION_TYPES.CREATE_CHALLENGE, props<{ challenge: Partial<Challenge>; notify?: boolean }>());
export const fetchChallenge = createAction(CHALLENGE_ACTION_TYPES.FETCH_CHALLENGE, props<{ challenge_id: string; notify?: boolean }>());
export const fetchChallenges = createAction(CHALLENGE_ACTION_TYPES.FETCH_CHALLENGES, props<{ query?: string; notify?: boolean }>());
export const putChallenge = createAction(
  CHALLENGE_ACTION_TYPES.PUT_CHALLENGE, props<{ challenge_id: string; challenge: Partial<Challenge> }>());
export const putChallenges = createAction(CHALLENGE_ACTION_TYPES.PUT_CHALLENGES, props<{ challenges: Partial<Challenge>[] }>());
export const resetChallenges = createAction(CHALLENGE_ACTION_TYPES.RESET);
export const updateChallenge = createAction(
  CHALLENGE_ACTION_TYPES.UPDATE_CHALLENGE, props<{ challenge_id: string; challenge: Partial<Challenge>; notify?: boolean }>());
export const postChallengePictures = createAction(
  CHALLENGE_ACTION_TYPES.POST_PICTURES, props<{ challenge_id: string; pictures: Partial<Media>[]; notify?: boolean }>());
export const deleteChallengePicture = createAction(
  CHALLENGE_ACTION_TYPES.DELETE_PICTURE, props<{ challenge_id: string; picture_id: string; notify?: boolean }>());
export const postChallengeComment = createAction(
  CHALLENGE_ACTION_TYPES.POST_COMMENT, props<{ challenge_id: string; comment: Partial<Comment>; notify?: boolean }>());
export const deleteChallengeComment = createAction(
    CHALLENGE_ACTION_TYPES.DELETE_COMMENT, props<{ challenge_id: string; comment_id: string; notify?: boolean }>());
