export enum RootRoutes {
  ACCOUNT_REVIEW = 'account-review',
  ADMIN = 'admin',
  BOATS = 'boats',
  BOAT_CHECKLIST = 'boat-checklists',
  BOAT_INSTRUCTIONS = 'boat-instructions',
  CHALLENGES = 'challenges',
  CLINICS = 'clinics',
  DASHBOARD = 'dashboard',
  ERROR = 'error',
  FEEDBACK = 'feedback',
  HELP = 'help',
  LOGIN = 'login',
  LOGS = 'logs',
  MAINTENANCE = 'maintenance',
  PROFILES = 'profiles',
  PROFILE_SETTINGS = 'profile-settings',
  REQUIRED_ACTIONS = 'required-actions',
  ROOT = '/',
  SAILS = 'sails',
  SAIL_CHECKLISTS = 'sail-checklists',
  SAIL_PATHS = 'sail-paths',
  SAIL_REQUESTS = 'sail-requests',
  SEPARATOR = '/',
}

export enum SubRoutes {
  ARRIVAL_SAIL_CHECKLIST = 'arrival',
  CANCEL_SAIL = 'cancel',
  CREATE_BOAT = 'create',
  CREATE_BOAT_CHECKLIST = 'create',
  CREATE_CHALLENGE = 'create',
  CREATE_CLINIC = 'create',
  CREATE_MAINTENANCE = 'create',
  CREATE_SAIL = 'create',
  CREATE_SAIL_REQUEST = 'create',
  DEPARTURE_SAIL_CHECKLIST = 'departure',
  EDIT_BOAT = 'edit',
  EDIT_BOAT_CHECKLIST = 'edit',
  EDIT_BOAT_INSTRUCTIONS = 'edit',
  EDIT_CHALLENGE = 'edit',
  EDIT_CLINIC = 'edit',
  EDIT_CLINIC_ENROLLMENT = 'edit-enrollment',
  EDIT_MAINTENANCE = 'edit',
  EDIT_PROFILE = 'edit',
  EDIT_PROFILE_PRIVILEGES = 'edit-privileges',
  EDIT_SAIL = 'edit',
  EDIT_SAIL_CHECKLIST = 'edit',
  EDIT_SAIL_MANIFEST = 'edit-passengers',
  EDIT_SAIL_PATH = 'edit',
  EDIT_SAIL_REQUEST = 'edit',
  EMAIL_AND_PASSWORD = 'email-password',
  LIST_CHALLENGES = 'list',
  LIST_CLINICS = 'list',
  LIST_FEEDBACK = 'list',
  LIST_LOGS = 'list',
  LIST_SAIL_CATEGORIES = 'list',
  LIST_SAIL_PATHS = 'list',
  PROFILE_SETTINGS = 'settings',
  RECORD_SAIL_PATH = 'record',
  RESET_PASSWORD = 'reset-password',
  RESOLVE_MAINTENANCE = 'resolve',
  SUBMIT_FEEDBACK = 'submit',
  VIEW_BOAT = 'view',
  VIEW_BOAT_INSTRUCTIONS = 'view',
  VIEW_CHALLENGE = 'view',
  VIEW_CLINIC = 'view',
  VIEW_FEEDBACK = 'view',
  VIEW_LOGS = 'view',
  VIEW_MAINTENANCE = 'view',
  VIEW_PROFILE = 'view',
  VIEW_REQUIRED_ACTION = 'view',
  VIEW_SAIL = 'view',
  VIEW_SAIL_CHECKLIST = 'view',
  VIEW_SAIL_PATH = 'view',
  VIEW_SAIL_PER_PERSON = 'user-sails',
  VIEW_SAIL_PICTURES = 'pictures',
  VIEW_SAIL_REQUEST = 'view',
}

export enum FullRoutes {
  ROOT = RootRoutes.ROOT,
  SEPARATOR = RootRoutes.SEPARATOR,
  // ^ KEEP THESE FIRST^
  ACCOUNT_REVIEW = ROOT + RootRoutes.ACCOUNT_REVIEW,
  ADMIN = ROOT + RootRoutes.ADMIN,
  BOATS = ROOT + RootRoutes.BOATS,
  BOAT_CHECKLISTS = ROOT + RootRoutes.BOAT_CHECKLIST,
  BOAT_INSTRUCTIONS = ROOT + RootRoutes.BOAT_INSTRUCTIONS,
  CHALLENGES = ROOT + RootRoutes.CHALLENGES,
  CLINICS = ROOT + RootRoutes.CLINICS,
  DASHBOARD = ROOT + RootRoutes.DASHBOARD,
  FEEDBACK = ROOT + RootRoutes.FEEDBACK,
  HELP = ROOT + RootRoutes.HELP,
  LOGIN = ROOT + RootRoutes.LOGIN,
  LOGS = ROOT + RootRoutes.LOGS,
  MAINTENANCE = ROOT + RootRoutes.MAINTENANCE,
  PROFILE = ROOT + RootRoutes.PROFILES,
  REQUIRED_ACTIONS = ROOT + RootRoutes.REQUIRED_ACTIONS,
  SAILS = ROOT + RootRoutes.SAILS,
  SAIL_CHECKLISTS = ROOT + RootRoutes.SAIL_CHECKLISTS,
  SAIL_PATHS = ROOT + RootRoutes.SAIL_PATHS,
  SAIL_REQUESTS = ROOT + RootRoutes.SAIL_REQUESTS,
  // ^ KEEP THESE SECOND^
  ARRIVAL_SAIL_CHECKLIST = SAIL_CHECKLISTS + SEPARATOR + SubRoutes.ARRIVAL_SAIL_CHECKLIST,
  CANCEL_SAIL = SAILS + SEPARATOR + SubRoutes.CANCEL_SAIL,
  CREATE_BOAT = BOATS + SEPARATOR + SubRoutes.CREATE_BOAT,
  CREATE_CHALLENGE = CHALLENGES + SEPARATOR + SubRoutes.CREATE_CHALLENGE,
  CREATE_CLINIC = CLINICS + SEPARATOR + SubRoutes.CREATE_CLINIC,
  CREATE_MAINTENANCE = MAINTENANCE + SEPARATOR + SubRoutes.CREATE_MAINTENANCE,
  CREATE_SAIL = SAILS + SEPARATOR + SubRoutes.CREATE_SAIL,
  CREATE_SAIL_REQUEST = SAIL_REQUESTS + SEPARATOR + SubRoutes.CREATE_SAIL_REQUEST,
  DEPARTURE_SAIL_CHECKLIST = SAIL_CHECKLISTS + SEPARATOR + SubRoutes.DEPARTURE_SAIL_CHECKLIST,
  EDIT_BOAT = BOATS + SEPARATOR + SubRoutes.EDIT_BOAT,
  EDIT_BOAT_CHECKLIST = BOAT_CHECKLISTS + SEPARATOR + SubRoutes.EDIT_BOAT_CHECKLIST,
  EDIT_BOAT_INSTRUCTIONS = BOAT_INSTRUCTIONS + SEPARATOR + SubRoutes.EDIT_BOAT_INSTRUCTIONS,
  EDIT_CHALLENGE = CHALLENGES + SEPARATOR + SubRoutes.EDIT_CHALLENGE,
  EDIT_CLINIC = CLINICS + SEPARATOR + SubRoutes.EDIT_CLINIC,
  EDIT_CLINIC_ENROLLMENT = CLINICS + SEPARATOR + SubRoutes.EDIT_CLINIC_ENROLLMENT,
  EDIT_MAINTENANCE = MAINTENANCE + SEPARATOR + SubRoutes.EDIT_MAINTENANCE,
  EDIT_PROFILE = PROFILE + SEPARATOR + SubRoutes.EDIT_PROFILE,
  EDIT_PROFILE_PRIVILEGES = ADMIN + SEPARATOR + SubRoutes.EDIT_PROFILE_PRIVILEGES,
  EDIT_SAIL = SAILS + SEPARATOR + SubRoutes.EDIT_SAIL,
  EDIT_SAIL_CHECKLIST = SAIL_CHECKLISTS + SEPARATOR + SubRoutes.EDIT_SAIL_CHECKLIST,
  EDIT_SAIL_MANIFEST = SAILS + SEPARATOR + SubRoutes.EDIT_SAIL_MANIFEST,
  EDIT_SAIL_PATH = SAIL_PATHS + SEPARATOR + SubRoutes.EDIT_SAIL_PATH,
  EDIT_SAIL_REQUEST = SAIL_REQUESTS + SEPARATOR + SubRoutes.EDIT_SAIL_REQUEST,
  EMAIL_AND_PASSWORD = LOGIN + SEPARATOR + SubRoutes.EMAIL_AND_PASSWORD,
  LIST_CHALLENGES = CHALLENGES + SEPARATOR + SubRoutes.LIST_CHALLENGES,
  LIST_CLINICS = CLINICS + SEPARATOR + SubRoutes.LIST_CLINICS,
  LIST_FEEDBACK = FEEDBACK + SEPARATOR + SubRoutes.LIST_FEEDBACK,
  LIST_LOGS = LOGS + SEPARATOR + SubRoutes.LIST_LOGS,
  LIST_SAIL_CATEGORIES = ADMIN + SEPARATOR + SubRoutes.LIST_SAIL_CATEGORIES,
  LIST_SAIL_PATHS = SAIL_PATHS + SEPARATOR + SubRoutes.LIST_SAIL_PATHS,
  PROFILE_SETTINGS = PROFILE + SEPARATOR + SubRoutes.PROFILE_SETTINGS,
  RECORD_SAIL_PATH = SAIL_PATHS + SEPARATOR + SubRoutes.RECORD_SAIL_PATH,
  RESET_PASSWORD = LOGIN + SEPARATOR + SubRoutes.RESET_PASSWORD,
  RESOLVE_MAINTENANCE = MAINTENANCE + SEPARATOR + SubRoutes.RESOLVE_MAINTENANCE,
  SUBMIT_FEEDBACK = FEEDBACK + SEPARATOR + SubRoutes.SUBMIT_FEEDBACK,
  VIEW_BOAT = BOATS + SEPARATOR + SubRoutes.VIEW_BOAT,
  VIEW_BOAT_INSTRUCTIONS = BOAT_INSTRUCTIONS + SEPARATOR + SubRoutes.VIEW_BOAT_INSTRUCTIONS,
  VIEW_CHALLENGE = CHALLENGES + SEPARATOR + SubRoutes.VIEW_CHALLENGE,
  VIEW_CLINIC = CLINICS + SEPARATOR + SubRoutes.VIEW_CLINIC,
  VIEW_FEEDBACK = FEEDBACK + SEPARATOR + SubRoutes.VIEW_FEEDBACK,
  VIEW_LOGS = LOGS + SEPARATOR + SubRoutes.VIEW_LOGS,
  VIEW_MAINTENANCE = MAINTENANCE + SEPARATOR + SubRoutes.VIEW_MAINTENANCE,
  VIEW_PROFILE = PROFILE + SEPARATOR + SubRoutes.VIEW_PROFILE,
  VIEW_REQUIRED_ACTION = REQUIRED_ACTIONS + SEPARATOR + SubRoutes.VIEW_REQUIRED_ACTION,
  VIEW_SAIL = SAILS + SEPARATOR + SubRoutes.VIEW_SAIL,
  VIEW_SAIL_CHECKLIST = SAIL_CHECKLISTS + SEPARATOR + SubRoutes.VIEW_SAIL_CHECKLIST,
  VIEW_SAIL_PATH = SAIL_PATHS + SEPARATOR + SubRoutes.VIEW_SAIL_PATH,
  VIEW_SAIL_PER_PERSON = SAILS + SEPARATOR + SubRoutes.VIEW_SAIL_PER_PERSON,
  VIEW_SAIL_PICTURES = SAILS + SEPARATOR + SubRoutes.VIEW_SAIL_PICTURES,
  VIEW_SAIL_REQUEST = SAIL_REQUESTS + SEPARATOR + SubRoutes.VIEW_SAIL_REQUEST,
}

export const adminRoute = FullRoutes.ADMIN;
export const arrivalSailChecklistRoute = (id: string) => `${FullRoutes.ARRIVAL_SAIL_CHECKLIST}/${id}`;
export const boatsRoute = FullRoutes.BOATS;
export const cancelSailRoute = (sail_id: string) => `${FullRoutes.CANCEL_SAIL}/${sail_id}`;
export const challengesRoute = FullRoutes.CHALLENGES;
export const clinicsRoute = FullRoutes.CLINICS;
export const createBoatRoute = FullRoutes.CREATE_BOAT;
export const createChallengeRoute = FullRoutes.CREATE_CHALLENGE;
export const createClinicRoute = FullRoutes.CREATE_CLINIC;
export const createMaintenanceRoute = FullRoutes.CREATE_MAINTENANCE;
export const createSailFromRequestRoute = (sail_request_id: string) => `${FullRoutes.CREATE_SAIL}/${sail_request_id}`;
export const createSailRequestRoute = FullRoutes.CREATE_SAIL_REQUEST;
export const createSailRoute = FullRoutes.CREATE_SAIL;
export const departureSailChecklistRoute = (id: string) => `${FullRoutes.DEPARTURE_SAIL_CHECKLIST}/${id}`;
export const editBoatInstructionsRoute = (boat_id: string) => `${FullRoutes.EDIT_BOAT_INSTRUCTIONS}/${boat_id}`;
export const editBoatRoute = (boat_id: string) => `${FullRoutes.EDIT_BOAT}/${boat_id}`;
export const editBoatChecklistRoute = (boat_id: string) => `${FullRoutes.EDIT_BOAT_CHECKLIST}/${boat_id}`;
export const editChallengeRoute = (challengeId: string) => `${FullRoutes.EDIT_CHALLENGE}/${challengeId}`;
export const editClinicEnrollmentRoute = (clinicId: string) => `${FullRoutes.EDIT_CLINIC_ENROLLMENT}/${clinicId}`;
export const editClinicRoute = (clinicId: string) => `${FullRoutes.EDIT_CLINIC}/${clinicId}`;
export const editMaintenanceRoute = (maintenanceId: string) => `${FullRoutes.EDIT_MAINTENANCE}/${maintenanceId}`;
export const editProfilePrivilegesRoute = (profile_id: string) => `${FullRoutes.EDIT_PROFILE_PRIVILEGES}/${profile_id}`;
export const editProfileRoute = (profile_id: string) => `${FullRoutes.EDIT_PROFILE}/${profile_id}`;
export const editSailChecklistRoute = (id: string) => `${FullRoutes.EDIT_SAIL_CHECKLIST}/${id}`;
export const editSailManifestRoute = (sail_id: string) => `${FullRoutes.EDIT_SAIL_MANIFEST}/${sail_id}`;
export const editSailPathRoute = (sailPathId: string) => `${FullRoutes.EDIT_SAIL_PATH}/${sailPathId}`;
export const editSailRequestRoute = (id: string) => `${FullRoutes.EDIT_SAIL_REQUEST}/${id}`;
export const editSailRoute = (sail_id: string) => `${FullRoutes.EDIT_SAIL}/${sail_id}`;
export const helpRoute = FullRoutes.HELP;
export const listChallengesRoute = `${FullRoutes.LIST_CHALLENGES}`;
export const listClinicsRoute = () => `${FullRoutes.LIST_CLINICS}`;
export const listFeedbackRoute = (sail_id: string) => `${FullRoutes.LIST_FEEDBACK}/${sail_id}`;
export const listLogsRoute = `${FullRoutes.LIST_LOGS}`;
export const listSailCategoriesRoute = FullRoutes.LIST_SAIL_CATEGORIES;
export const listSailPathsRoute = (sail_id: string) => `${FullRoutes.LIST_SAIL_PATHS}/${sail_id}`;
export const loginWithEmailAndPassword = FullRoutes.EMAIL_AND_PASSWORD;
export const maintenanceRoute = FullRoutes.MAINTENANCE;
export const profileSettingsRoute = FullRoutes.PROFILE_SETTINGS;
export const recordSailPathRoute = (sailPathId: string) => `${FullRoutes.RECORD_SAIL_PATH}/${sailPathId}`;
export const resetPassword = FullRoutes.RESET_PASSWORD;
export const resolveMaintenanceRoute = (maintenanceId: string) => `${FullRoutes.RESOLVE_MAINTENANCE}/${maintenanceId}`;
export const sailChecklistsRoute = FullRoutes.SAIL_CHECKLISTS;
export const sailRequestsRoute = FullRoutes.SAIL_REQUESTS;
export const sailsRoute = FullRoutes.SAILS;
export const submitFeedbackRoute = (sail_id: string) => `${FullRoutes.SUBMIT_FEEDBACK}/${sail_id}`;
export const viewBoatInstructionsRoute = (boat_id: string) => `${FullRoutes.VIEW_BOAT_INSTRUCTIONS}/${boat_id}`;
export const viewBoatRoute = (boat_id: string) => `${FullRoutes.VIEW_BOAT}/${boat_id}`;
export const viewChallengeRoute = (challengeId: string) => `${FullRoutes.VIEW_CHALLENGE}/${challengeId}`;
export const viewClinicRoute = (clinicId: string) => `${FullRoutes.VIEW_CLINIC}/${clinicId}`;
export const viewFeedbackRoute = (feedbackId: string) => `${FullRoutes.VIEW_FEEDBACK}/${feedbackId}`;
export const viewLogsRoute = (profile_id: string) => `${FullRoutes.VIEW_LOGS}/${profile_id}`;
export const viewMaintenanceRoute = (maintenanceId: string) => `${FullRoutes.VIEW_MAINTENANCE}/${maintenanceId}`;
export const viewProfileRoute = (profile_id: string) => `${FullRoutes.VIEW_PROFILE}/${profile_id}`;
export const viewRequiredActionRoute = (required_action_id: string) => `${FullRoutes.VIEW_REQUIRED_ACTION}/${required_action_id}`;
export const viewSailChecklistRoute = (sail_id: string) => `${FullRoutes.VIEW_SAIL_CHECKLIST}/${sail_id}`;
export const viewSailPathRoute = (sailPathId: string) => `${FullRoutes.VIEW_SAIL_PATH}/${sailPathId}`;
export const viewSailPicturesRoute = (sail_id: string) => `${FullRoutes.VIEW_SAIL_PICTURES}/${sail_id}`;
export const viewSailRequestRoute = (id: string) => `${FullRoutes.VIEW_SAIL_REQUEST}/${id}`;
export const viewSailRoute = (sail_id: string) => `${FullRoutes.VIEW_SAIL}/${sail_id}`;
export const viewUserSailsRoute = (profile_id: string) => `${FullRoutes.VIEW_SAIL_PER_PERSON}/${profile_id}`;
