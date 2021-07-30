export enum ROOT_ROUTES {
  ACCOUNT_REVIEW = 'account-review',
  ADMIN = 'admin',
  BOATS = 'boats',
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
  PROFILE_SETTNIGS = 'profile-settings',
  REQUIRED_ACTIONS = 'required-actions',
  ROOT = '/',
  SAILS = 'sails',
  SAIL_CHECKLISTS = 'sail-checklists',
  SAIL_PATHS = 'sail-paths',
  SAIL_PEOPLE_MANIFEST = 'sail-people-manifest',
  SAIL_REQUESTS = 'sail-requests',
  SEPARATOR = '/',
}

export enum SUB_ROUTES {
  ARRIVAL_SAIL_CHECKLIST = 'arrival',
  CANCEL_SAIL = 'cancel',
  CREATE_BOAT = 'create',
  CREATE_CHALLENGE = 'create',
  CREATE_CLINIC = 'create',
  CREATE_MAINTENANCE = 'create',
  CREATE_SAIL = 'create',
  CREATE_SAIL_REQUEST = 'create',
  DEPARTURE_SAIL_CHECKLIST = 'departure',
  EDIT_BOAT = 'edit',
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
  EDIT_SAIL_PEOPLE_MANIFEST = 'edit',
  EDIT_SAIL_REQUEST = 'edit',
  EMAIL_AND_PASSWORD = 'email-password',
  LIST_CHALLENGES = 'list',
  LIST_CLINICS = 'list',
  LIST_FEEDBACK = 'list',
  LIST_LOGS = 'list',
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
  VIEW_SAIL_PEOPLE_MANIFEST = 'view',
  VIEW_SAIL_PER_PERSON = 'user-sails',
  VIEW_SAIL_PICTURES = 'pictures',
  VIEW_SAIL_REQUEST = 'view',
}

export enum FULL_ROUTES {
  ROOT = ROOT_ROUTES.ROOT,
  SEPARATOR = ROOT_ROUTES.SEPARATOR,
  // ^ KEEP THESE FIRST^
  ACCOUNT_REVIEW = ROOT + ROOT_ROUTES.ACCOUNT_REVIEW,
  ADMIN = ROOT + ROOT_ROUTES.ADMIN,
  BOATS = ROOT + ROOT_ROUTES.BOATS,
  BOAT_INSTRUCTIONS = ROOT + ROOT_ROUTES.BOAT_INSTRUCTIONS,
  CHALLENGES = ROOT + ROOT_ROUTES.CHALLENGES,
  CLINICS = ROOT + ROOT_ROUTES.CLINICS,
  DASHBOARD = ROOT + ROOT_ROUTES.DASHBOARD,
  FEEDBACK = ROOT + ROOT_ROUTES.FEEDBACK,
  HELP = ROOT + ROOT_ROUTES.HELP,
  LOGIN = ROOT + ROOT_ROUTES.LOGIN,
  LOGS = ROOT + ROOT_ROUTES.LOGS,
  MAINTENACE = ROOT + ROOT_ROUTES.MAINTENANCE,
  PROFILE = ROOT + ROOT_ROUTES.PROFILES,
  REQUIRED_ACTIONS = ROOT + ROOT_ROUTES.REQUIRED_ACTIONS,
  SAILS = ROOT + ROOT_ROUTES.SAILS,
  SAIL_CHECKLISTS = ROOT + ROOT_ROUTES.SAIL_CHECKLISTS,
  SAIL_PATHS = ROOT + ROOT_ROUTES.SAIL_PATHS,
  SAIL_PEOPLE_MANIFEST = ROOT + ROOT_ROUTES.SAIL_PEOPLE_MANIFEST,
  SAIL_REQUESTS = ROOT + ROOT_ROUTES.SAIL_REQUESTS,
  // ^ KEEP THESE SECOND^
  ARRIVAL_SAIL_CHECKLIST = SAIL_CHECKLISTS + SEPARATOR + SUB_ROUTES.ARRIVAL_SAIL_CHECKLIST,
  CANCEL_SAIL = SAILS + SEPARATOR + SUB_ROUTES.CANCEL_SAIL,
  CREATE_BOAT = BOATS + SEPARATOR + SUB_ROUTES.CREATE_BOAT,
  CREATE_CHALLENGE = CHALLENGES + SEPARATOR + SUB_ROUTES.CREATE_CHALLENGE,
  CREATE_CLINIC = CLINICS + SEPARATOR + SUB_ROUTES.CREATE_CLINIC,
  CREATE_MAINTENANCE = MAINTENACE + SEPARATOR + SUB_ROUTES.CREATE_MAINTENANCE,
  CREATE_SAIL = SAILS + SEPARATOR + SUB_ROUTES.CREATE_SAIL,
  CREATE_SAIL_REQUEST = SAIL_REQUESTS + SEPARATOR + SUB_ROUTES.CREATE_SAIL_REQUEST,
  DEPARTURE_SAIL_CHECKLIST = SAIL_CHECKLISTS + SEPARATOR + SUB_ROUTES.DEPARTURE_SAIL_CHECKLIST,
  EDIT_BOAT = BOATS + SEPARATOR + SUB_ROUTES.EDIT_BOAT,
  EDIT_BOAT_INSTRUCTIONS = BOAT_INSTRUCTIONS + SEPARATOR + SUB_ROUTES.EDIT_BOAT_INSTRUCTIONS,
  EDIT_CHALLENGE = CHALLENGES + SEPARATOR + SUB_ROUTES.EDIT_CHALLENGE,
  EDIT_CLINIC = CLINICS + SEPARATOR + SUB_ROUTES.EDIT_CLINIC,
  EDIT_CLINIC_ENROLLMENT = CLINICS + SEPARATOR + SUB_ROUTES.EDIT_CLINIC_ENROLLMENT,
  EDIT_MAINTENANCE = MAINTENACE + SEPARATOR + SUB_ROUTES.EDIT_MAINTENANCE,
  EDIT_PROFILE = PROFILE + SEPARATOR + SUB_ROUTES.EDIT_PROFILE,
  EDIT_PROFILE_PRIVILEGES = ADMIN + SEPARATOR + SUB_ROUTES.EDIT_PROFILE_PRIVILEGES,
  EDIT_SAIL = SAILS + SEPARATOR + SUB_ROUTES.EDIT_SAIL,
  EDIT_SAIL_CHECKLIST = SAIL_CHECKLISTS + SEPARATOR + SUB_ROUTES.EDIT_SAIL_CHECKLIST,
  EDIT_SAIL_MANIFEST = SAILS + SEPARATOR + SUB_ROUTES.EDIT_SAIL_MANIFEST,
  EDIT_SAIL_PATH = SAIL_PATHS + SEPARATOR + SUB_ROUTES.EDIT_SAIL_PATH,
  EDIT_SAIL_PEOPLE_MANIFEST = SAIL_PEOPLE_MANIFEST + SEPARATOR + SUB_ROUTES.EDIT_SAIL_PEOPLE_MANIFEST,
  EDIT_SAIL_REQUEST = SAIL_REQUESTS + SEPARATOR + SUB_ROUTES.EDIT_SAIL_REQUEST,
  EMAIL_AND_PASSWORD = LOGIN + SEPARATOR + SUB_ROUTES.EMAIL_AND_PASSWORD,
  LIST_CHALLENGES = CHALLENGES + SEPARATOR + SUB_ROUTES.LIST_CHALLENGES,
  LIST_CLICNICS = CLINICS + SEPARATOR + SUB_ROUTES.LIST_CLINICS,
  LIST_FEEDBACK = FEEDBACK + SEPARATOR + SUB_ROUTES.LIST_FEEDBACK,
  LIST_LOGS = LOGS + SEPARATOR + SUB_ROUTES.LIST_LOGS,
  LIST_SAIL_PATHS = SAIL_PATHS + SEPARATOR + SUB_ROUTES.LIST_SAIL_PATHS,
  PROFILE_SETTINGS = PROFILE + SEPARATOR + SUB_ROUTES.PROFILE_SETTINGS,
  RECORD_SAIL_PATH = SAIL_PATHS + SEPARATOR + SUB_ROUTES.RECORD_SAIL_PATH,
  RESET_PASSWORD = LOGIN + SEPARATOR + SUB_ROUTES.RESET_PASSWORD,
  RESOLVE_MAINTENANCE = MAINTENACE + SEPARATOR + SUB_ROUTES.RESOLVE_MAINTENANCE,
  SUBMIT_FEEDBACK = FEEDBACK + SEPARATOR + SUB_ROUTES.SUBMIT_FEEDBACK,
  VIEW_BOAT = BOATS + SEPARATOR + SUB_ROUTES.VIEW_BOAT,
  VIEW_BOAT_INSTRUCTIONS = BOAT_INSTRUCTIONS + SEPARATOR + SUB_ROUTES.VIEW_BOAT_INSTRUCTIONS,
  VIEW_CHALLENGE = CHALLENGES + SEPARATOR + SUB_ROUTES.VIEW_CHALLENGE,
  VIEW_CLINIC = CLINICS + SEPARATOR + SUB_ROUTES.VIEW_CLINIC,
  VIEW_FEEDBACK = FEEDBACK + SEPARATOR + SUB_ROUTES.VIEW_FEEDBACK,
  VIEW_LOGS = LOGS + SEPARATOR + SUB_ROUTES.VIEW_LOGS,
  VIEW_MAINTENANCE = MAINTENACE + SEPARATOR + SUB_ROUTES.VIEW_MAINTENANCE,
  VIEW_PROFILE = PROFILE + SEPARATOR + SUB_ROUTES.VIEW_PROFILE,
  VIEW_REQUIRED_ACTION = REQUIRED_ACTIONS + SEPARATOR + SUB_ROUTES.VIEW_REQUIRED_ACTION,
  VIEW_SAIL = SAILS + SEPARATOR + SUB_ROUTES.VIEW_SAIL,
  VIEW_SAIL_CHECKLIST = SAIL_CHECKLISTS + SEPARATOR + SUB_ROUTES.VIEW_SAIL_CHECKLIST,
  VIEW_SAIL_PATH = SAIL_PATHS + SEPARATOR + SUB_ROUTES.VIEW_SAIL_PATH,
  VIEW_SAIL_PEOPLE_MANIFEST = SAIL_PEOPLE_MANIFEST + SEPARATOR + SUB_ROUTES.VIEW_SAIL_PEOPLE_MANIFEST,
  VIEW_SAIL_PER_PERSON = SAILS + SEPARATOR + SUB_ROUTES.VIEW_SAIL_PER_PERSON,
  VIEW_SAIL_PICTURES = SAILS + SEPARATOR + SUB_ROUTES.VIEW_SAIL_PICTURES,
  VIEW_SAIL_REQUEST = SAIL_REQUESTS + SEPARATOR + SUB_ROUTES.VIEW_SAIL_REQUEST,
}

export const adminRoute = FULL_ROUTES.ADMIN;
export const arrivalSailChecklistRoute = (id: string) => `${FULL_ROUTES.ARRIVAL_SAIL_CHECKLIST}/${id}`;
export const boatsRoute = FULL_ROUTES.BOATS;
export const cancelSailRoute = (sail_id: string) => `${FULL_ROUTES.CANCEL_SAIL}/${sail_id}`;
export const challengesRoute = FULL_ROUTES.CHALLENGES;
export const clinicsRoute = FULL_ROUTES.CLINICS;
export const createBoatRoute = FULL_ROUTES.CREATE_BOAT;
export const createChallengeRoute = FULL_ROUTES.CREATE_CHALLENGE;
export const createClinicRoute = FULL_ROUTES.CREATE_CLINIC;
export const createMaintenanceRoute = FULL_ROUTES.CREATE_MAINTENANCE;
export const createSailFromRequestRoute = (sailRequestId: string) => `${FULL_ROUTES.CREATE_SAIL}/${sailRequestId}`;
export const createSailRequestRoute = FULL_ROUTES.CREATE_SAIL_REQUEST;
export const createSailRoute = FULL_ROUTES.CREATE_SAIL;
export const departureSailChecklistRoute = (id: string) => `${FULL_ROUTES.DEPARTURE_SAIL_CHECKLIST}/${id}`;
export const editBoatInstructionsRoute = (boat_id: string) => `${FULL_ROUTES.EDIT_BOAT_INSTRUCTIONS}/${boat_id}`;
export const editBoatRoute = (boat_id: string) => `${FULL_ROUTES.EDIT_BOAT}/${boat_id}`;
export const editChallengeRoute = (challengeId: string) => `${FULL_ROUTES.EDIT_CHALLENGE}/${challengeId}`;
export const editClinicEnrollmentRoute = (clinicId: string) => `${FULL_ROUTES.EDIT_CLINIC_ENROLLMENT}/${clinicId}`;
export const editClinicRoute = (clinicId: string) => `${FULL_ROUTES.EDIT_CLINIC}/${clinicId}`;
export const editMaintenanceRoute = (maintenanceId: string) => `${FULL_ROUTES.EDIT_MAINTENANCE}/${maintenanceId}`;
export const editProfilePrivilegesRoute = (profile_id: string) => `${FULL_ROUTES.EDIT_PROFILE_PRIVILEGES}/${profile_id}`;
export const editProfileRoute = (profile_id: string) => `${FULL_ROUTES.EDIT_PROFILE}/${profile_id}`;
export const editSailChecklistRoute = (id: string) => `${FULL_ROUTES.EDIT_SAIL_CHECKLIST}/${id}`;
export const editSailManifestRoute = (sail_id: string) => `${FULL_ROUTES.EDIT_SAIL_MANIFEST}/${sail_id}`;
export const editSailPathRoute = (sailPathId: string) => `${FULL_ROUTES.EDIT_SAIL_PATH}/${sailPathId}`;
export const editSailPeopleManifestRoute = (sailChecklistId: string) => `${FULL_ROUTES.EDIT_SAIL_PEOPLE_MANIFEST}/${sailChecklistId}`;
export const editSailRequestRoute = (id: string) => `${FULL_ROUTES.EDIT_SAIL_REQUEST}/${id}`;
export const editSailRoute = (sail_id: string) => `${FULL_ROUTES.EDIT_SAIL}/${sail_id}`;
export const helpRoute = FULL_ROUTES.HELP;
export const listChallengesRoute = `${FULL_ROUTES.LIST_CHALLENGES}`;
export const listClinicsRoute = () => `${FULL_ROUTES.LIST_CLICNICS}`;
export const listFeedbackRoute = (sail_id: string) => `${FULL_ROUTES.LIST_FEEDBACK}/${sail_id}`;
export const listLogsRoute = `${FULL_ROUTES.LIST_LOGS}`;
export const listSailPathsRoute = (sail_id: string) => `${FULL_ROUTES.LIST_SAIL_PATHS}/${sail_id}`;
export const loginWithEmailAndPassword = FULL_ROUTES.EMAIL_AND_PASSWORD;
export const maintenanceRoute = FULL_ROUTES.MAINTENACE;
export const profileSettingsRoute = FULL_ROUTES.PROFILE_SETTINGS;
export const recordSailPathRoute = (sailPathId: string) => `${FULL_ROUTES.RECORD_SAIL_PATH}/${sailPathId}`;
export const resetPassword = FULL_ROUTES.RESET_PASSWORD;
export const resolveMaintenanceRoute = (maintenanceId: string) => `${FULL_ROUTES.RESOLVE_MAINTENANCE}/${maintenanceId}`;
export const sailChecklistsRoute = FULL_ROUTES.SAIL_CHECKLISTS;
export const sailRequestsRoute = FULL_ROUTES.SAIL_REQUESTS;
export const sailsRoute = FULL_ROUTES.SAILS;
export const submitFeedbackRoute = (sail_id: string) => `${FULL_ROUTES.SUBMIT_FEEDBACK}/${sail_id}`;
export const viewBoatInstructionsRoute = (boat_id: string) => `${FULL_ROUTES.VIEW_BOAT_INSTRUCTIONS}/${boat_id}`;
export const viewBoatRoute = (boat_id: string) => `${FULL_ROUTES.VIEW_BOAT}/${boat_id}`;
export const viewChallengeRoute = (challengeId: string) => `${FULL_ROUTES.VIEW_CHALLENGE}/${challengeId}`;
export const viewClinicRoute = (clinicId: string) => `${FULL_ROUTES.VIEW_CLINIC}/${clinicId}`;
export const viewFeedbackRoute = (feedbackId: string) => `${FULL_ROUTES.VIEW_FEEDBACK}/${feedbackId}`;
export const viewLogsRoute = (profile_id: string) => `${FULL_ROUTES.VIEW_LOGS}/${profile_id}`;
export const viewMaintenanceRoute = (maintenanceId: string) => `${FULL_ROUTES.VIEW_MAINTENANCE}/${maintenanceId}`;
export const viewProfileRoute = (profile_id: string) => `${FULL_ROUTES.VIEW_PROFILE}/${profile_id}`;
export const viewRequiredActionRoute = (required_action_id: string) => `${FULL_ROUTES.VIEW_REQUIRED_ACTION}/${required_action_id}`;
export const viewSailChecklistRoute = (sail_id: string) => `${FULL_ROUTES.VIEW_SAIL_CHECKLIST}/${sail_id}`;
export const viewSailPathRoute = (sailPathId: string) => `${FULL_ROUTES.VIEW_SAIL_PATH}/${sailPathId}`;
export const viewSailPeopleManifestRoute = (sailChecklistId: string) => `${FULL_ROUTES.VIEW_SAIL_PEOPLE_MANIFEST}/${sailChecklistId}`;
export const viewSailPicturesRoute = (sail_id: string) => `${FULL_ROUTES.VIEW_SAIL_PICTURES}/${sail_id}`;
export const viewSailRequestRoute = (id: string) => `${FULL_ROUTES.VIEW_SAIL_REQUEST}/${id}`;
export const viewSailRoute = (sail_id: string) => `${FULL_ROUTES.VIEW_SAIL}/${sail_id}`;
export const viewUserSailsRoute = (profile_id: string) => `${FULL_ROUTES.VIEW_SAIL_PER_PERSON}/${profile_id}`;
