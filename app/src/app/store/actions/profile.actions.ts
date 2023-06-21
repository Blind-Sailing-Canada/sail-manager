import {
  createAction,
  props,
} from '@ngrx/store';
import { Profile } from '../../../../../api/src/types/profile/profile';
import { ProfileReview } from '../../../../../api/src/types/profile/profile-review';

export enum PROFILE_ACTION_TYPES {
  FETCH_MANY = '[Profile] Fetch Many',
  FETCH_ONE = '[Profile] Fetch One',
  FETCH_COUNT = '[Profile] Fetch Count',
  PUT_COUNT = '[Profile] Put Count',
  PUT_MANY = '[Profile] Put Many',
  PUT_ONE = '[Profile] Put One',
  RESET = 'Reset',
  UPDATE_ROLE = '[Profile] Update Role',
  UPDATE_INFO = '[Profile] Update Info',
  REVIEW_PROFILE = '[Profile] Review profile',
  SEARCH_BY_NAME_OR_EMAIL = '[Profile] Search by name or email'
}

export const fetchTotalProfileCount = createAction(PROFILE_ACTION_TYPES.FETCH_COUNT);
export const fetchProfile = createAction(PROFILE_ACTION_TYPES.FETCH_ONE, props<{ profile_id: string }>());
export const searchProfilesByNameOrEmail = createAction(
  PROFILE_ACTION_TYPES.SEARCH_BY_NAME_OR_EMAIL, props<{ text: string; notify?: boolean }>());
export const fetchProfiles = createAction(PROFILE_ACTION_TYPES.FETCH_MANY, props<{ query: string; notify?: boolean }>());
export const putTotalProfileCount = createAction(PROFILE_ACTION_TYPES.PUT_COUNT, props<{ count: number }>());
export const putProfile = createAction(PROFILE_ACTION_TYPES.PUT_ONE, props<{ profile_id: string; profile: Profile }>());
export const putProfiles = createAction(PROFILE_ACTION_TYPES.PUT_MANY, props<{ profiles: Profile[] }>());
export const resetProfiles = createAction(PROFILE_ACTION_TYPES.RESET);
export const updateProfileInfo = createAction(
  PROFILE_ACTION_TYPES.UPDATE_INFO,
  props<{ profile_id: string; profile: Partial<Profile>; notify?: boolean }>());
export const reviewProfile = createAction(
  PROFILE_ACTION_TYPES.REVIEW_PROFILE,
  props<{ profile_id: string; profileReview: Partial<ProfileReview>; notify?: boolean }>());
