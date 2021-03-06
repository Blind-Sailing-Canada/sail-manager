import { appReducer } from './reducers/app.reducer';
import { boatMaintenanceReducer } from './reducers/boat-maintenance.reducer';
import { boatReducer } from './reducers/boat.reducer';
import { cdnReducer } from './reducers/cdn.reducer';
import { challengeReducer } from './reducers/challenge.reducer';
import { clinicsReducer } from './reducers/clinics.reducer';
import { documentReducer } from './reducers/document.reducer';
import { feedbackReducer } from './reducers/feedback.reducer';
import { futureSailsReducer } from './reducers/future-sails.reducer';
import { inProgressSailsReducer } from './reducers/in-progress-sails.reducer';
import { instructionsReducer } from './reducers/instructions.reducer';
import { loginReducer } from './reducers/login.reducer';
import { pastSailsReducer } from './reducers/past-sails.reducer';
import { profileReducer } from './reducers/profile.reducer';
import { requiredActionsReducer } from './reducers/required-actions.reducer';
import { sailCategoryReducer } from './reducers/sail-category.reducer';
import { sailChecklistReducer } from './reducers/sail-checklist.reducer';
import { sailReducer } from './reducers/sail.reducer';
import { sailRequestReducer } from './reducers/sail-request.reducer';
import { snackReducer } from './reducers/snack.reducer';
import { todaySailsReducer } from './reducers/today-sails.reducer';
import { userAccessReducer } from './reducers/user-access.reducer';
import { socialReducer } from './reducers/social.reducer';

export enum STORE_SLICES {
  APP = 'app',
  BOATS = 'boats',
  DOCUMENTS = 'documents',
  BOAT_MAINTENANCES = 'maintenances',
  CDN = 'cdn',
  CHALLENGES = 'challenges',
  CHECKLISTS = 'checklists',
  CLINICS = 'clinics',
  FEEDBACKS = 'feedbacks',
  FUTURE_SAILS = 'futureSails',
  INSTRUCTIONS = 'instructions',
  IN_PROGRESS_SAILS = 'inProgressSails',
  LOGIN = 'login',
  PAST_SAILS = 'pastSails',
  PROFILES = 'profiles',
  REQUIRED_ACTIONS = 'requiredActions',
  SAILS = 'sails',
  SOCIALS = 'socials',
  SAIL_CATEGORIES = 'sailCategories',
  SAIL_PATHS = 'sailPaths',
  SAIL_REQUESTS = 'sailRequests',
  SNACKS = 'snacks',
  TODAY_SAILS = 'todaySails',
  USER_ACCESS = 'userAccess',
}

export const store = {
  [STORE_SLICES.APP]: appReducer,
  [STORE_SLICES.BOATS]: boatReducer,
  [STORE_SLICES.BOAT_MAINTENANCES]: boatMaintenanceReducer,
  [STORE_SLICES.CDN]: cdnReducer,
  [STORE_SLICES.CHALLENGES]: challengeReducer,
  [STORE_SLICES.CHECKLISTS]: sailChecklistReducer,
  [STORE_SLICES.CLINICS]: clinicsReducer,
  [STORE_SLICES.DOCUMENTS]: documentReducer,
  [STORE_SLICES.FEEDBACKS]: feedbackReducer,
  [STORE_SLICES.FUTURE_SAILS]: futureSailsReducer,
  [STORE_SLICES.INSTRUCTIONS]: instructionsReducer,
  [STORE_SLICES.IN_PROGRESS_SAILS]: inProgressSailsReducer,
  [STORE_SLICES.LOGIN]: loginReducer,
  [STORE_SLICES.PAST_SAILS]: pastSailsReducer,
  [STORE_SLICES.PROFILES]: profileReducer,
  [STORE_SLICES.REQUIRED_ACTIONS]: requiredActionsReducer,
  [STORE_SLICES.SAILS]: sailReducer,
  [STORE_SLICES.SAIL_CATEGORIES]: sailCategoryReducer,
  [STORE_SLICES.SAIL_REQUESTS]: sailRequestReducer,
  [STORE_SLICES.SNACKS]: snackReducer,
  [STORE_SLICES.SOCIALS]: socialReducer,
  [STORE_SLICES.TODAY_SAILS]: todaySailsReducer,
  [STORE_SLICES.USER_ACCESS]: userAccessReducer,
};
