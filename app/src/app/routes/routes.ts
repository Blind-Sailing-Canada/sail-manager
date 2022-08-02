export enum RootRoutes {
  ACCOUNT_REVIEW = 'account-review',
  ADMIN = 'admin',
  BOATS = 'boats',
  BOAT_CHECKLIST = 'boat-checklists',
  BOAT_INSTRUCTIONS = 'boat-instructions',
  CHALLENGES = 'challenges',
  CLINICS = 'clinics',
  DASHBOARD = 'dashboard',
  DOCUMENTS = 'documents',
  ERROR = 'error',
  FEEDBACK = 'feedback',
  HELP = 'help',
  LOGIN = 'login',
  MAINTENANCE = 'maintenance',
  MEDIA = 'media',
  PROFILES = 'profiles',
  PROFILE_SETTINGS = 'profile-settings',
  REQUIRED_ACTIONS = 'required-actions',
  ROOT = '/',
  SAILS = 'sails',
  SAIL_CHECKLISTS = 'sail-checklists',
  SAIL_PATHS = 'sail-paths',
  SAIL_REQUESTS = 'sail-requests',
  SEPARATOR = '/',
  SOCIALS = 'social',
}

export enum SubRoutes {
  ARRIVAL_SAIL_CHECKLIST = 'arrival',
  CANCEL_SAIL = 'cancel',
  CANCEL_SOCIAL = 'cancel',
  CREATE_BOAT = 'create',
  CREATE_BOAT_CHECKLIST = 'create',
  CREATE_CHALLENGE = 'create',
  CREATE_CLINIC = 'create',
  CREATE_DOCUMENT = 'create',
  CREATE_MAINTENANCE = 'create',
  CREATE_SAIL = 'create',
  CREATE_SAIL_REQUEST = 'create',
  CREATE_SOCIAL = 'create',
  DB_QUERY = 'db',
  DEPARTURE_SAIL_CHECKLIST = 'departure',
  EDIT_BOAT = 'edit',
  EDIT_BOAT_CHECKLIST = 'edit',
  EDIT_BOAT_INSTRUCTIONS = 'edit',
  EDIT_CHALLENGE = 'edit',
  EDIT_CLINIC = 'edit',
  EDIT_CLINIC_ENROLLMENT = 'edit-enrollment',
  EDIT_DOCUMENT = 'edit',
  EDIT_MAINTENANCE = 'edit',
  EDIT_PROFILE = 'edit',
  EDIT_PROFILE_PRIVILEGES = 'edit-privileges',
  EDIT_SAIL = 'edit',
  EDIT_SAIL_CHECKLIST = 'edit',
  EDIT_SAIL_MANIFEST = 'edit-sailors',
  EDIT_SAIL_PATH = 'edit',
  EDIT_SAIL_REQUEST = 'edit',
  EDIT_SOCIAL = 'edit',
  EDIT_SOCIAL_MANIFEST = 'edit-attendants',
  EMAIL_AND_PASSWORD = 'email-password',
  LIST_CHALLENGES = 'list',
  LIST_CLINICS = 'list',
  LIST_DOCUMENTS = 'list',
  LIST_FEEDBACK = 'list',
  LIST_MEDIA = 'list',
  LIST_SAIL_CATEGORIES = 'list',
  LIST_SAIL_PATHS = 'list',
  LIST_SOCIALS = 'list',
  PROFILE_SETTINGS = 'settings',
  RECORD_SAIL_PATH = 'record',
  RESET_PASSWORD = 'reset-password',
  RESOLVE_MAINTENANCE = 'resolve',
  SUBMIT_FEEDBACK = 'submit',
  VIEW_BOAT = 'view',
  VIEW_BOAT_INSTRUCTIONS = 'view',
  VIEW_CHALLENGE = 'view',
  VIEW_CLINIC = 'view',
  VIEW_DOCUMENT = 'view',
  VIEW_FEEDBACK = 'view',
  VIEW_MAINTENANCE = 'view',
  VIEW_PROFILE = 'view',
  VIEW_REQUIRED_ACTION = 'view',
  VIEW_SAIL = 'view',
  VIEW_SAIL_CHECKLIST = 'view',
  VIEW_SAIL_PATH = 'view',
  VIEW_SAIL_PER_PERSON = 'user-sails',
  VIEW_SAIL_PICTURES = 'pictures',
  VIEW_SAIL_REQUEST = 'view',
  VIEW_SOCIAL = 'view',
  VIEW_SOCIAL_PICTURES = 'pictures',
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
  DOCUMENTS = ROOT + RootRoutes.DOCUMENTS,
  FEEDBACK = ROOT + RootRoutes.FEEDBACK,
  HELP = ROOT + RootRoutes.HELP,
  LOGIN = ROOT + RootRoutes.LOGIN,
  MAINTENANCE = ROOT + RootRoutes.MAINTENANCE,
  MEDIA = ROOT + RootRoutes.MEDIA,
  PROFILE = ROOT + RootRoutes.PROFILES,
  REQUIRED_ACTIONS = ROOT + RootRoutes.REQUIRED_ACTIONS,
  SAILS = ROOT + RootRoutes.SAILS,
  SAIL_CHECKLISTS = ROOT + RootRoutes.SAIL_CHECKLISTS,
  SAIL_PATHS = ROOT + RootRoutes.SAIL_PATHS,
  SAIL_REQUESTS = ROOT + RootRoutes.SAIL_REQUESTS,
  SOCIALS = ROOT + RootRoutes.SOCIALS,
  // ^ KEEP THESE SECOND^
  ADMIN_DB = ADMIN + SEPARATOR + SubRoutes.DB_QUERY,
  ARRIVAL_SAIL_CHECKLIST = SAIL_CHECKLISTS + SEPARATOR + SubRoutes.ARRIVAL_SAIL_CHECKLIST,
  CANCEL_SAIL = SAILS + SEPARATOR + SubRoutes.CANCEL_SAIL,
  CANCEL_SOCIAL = SOCIALS + SEPARATOR + SubRoutes.CANCEL_SOCIAL,
  CREATE_BOAT = BOATS + SEPARATOR + SubRoutes.CREATE_BOAT,
  CREATE_CHALLENGE = CHALLENGES + SEPARATOR + SubRoutes.CREATE_CHALLENGE,
  CREATE_CLINIC = CLINICS + SEPARATOR + SubRoutes.CREATE_CLINIC,
  CREATE_DOCUMENT = DOCUMENTS + SEPARATOR + SubRoutes.CREATE_DOCUMENT,
  CREATE_MAINTENANCE = MAINTENANCE + SEPARATOR + SubRoutes.CREATE_MAINTENANCE,
  CREATE_SAIL = SAILS + SEPARATOR + SubRoutes.CREATE_SAIL,
  CREATE_SAIL_REQUEST = SAIL_REQUESTS + SEPARATOR + SubRoutes.CREATE_SAIL_REQUEST,
  CREATE_SOCIAL = SOCIALS + SEPARATOR + SubRoutes.CREATE_SOCIAL,
  DEPARTURE_SAIL_CHECKLIST = SAIL_CHECKLISTS + SEPARATOR + SubRoutes.DEPARTURE_SAIL_CHECKLIST,
  EDIT_BOAT = BOATS + SEPARATOR + SubRoutes.EDIT_BOAT,
  EDIT_BOAT_CHECKLIST = BOAT_CHECKLISTS + SEPARATOR + SubRoutes.EDIT_BOAT_CHECKLIST,
  EDIT_BOAT_INSTRUCTIONS = BOAT_INSTRUCTIONS + SEPARATOR + SubRoutes.EDIT_BOAT_INSTRUCTIONS,
  EDIT_CHALLENGE = CHALLENGES + SEPARATOR + SubRoutes.EDIT_CHALLENGE,
  EDIT_CLINIC = CLINICS + SEPARATOR + SubRoutes.EDIT_CLINIC,
  EDIT_CLINIC_ENROLLMENT = CLINICS + SEPARATOR + SubRoutes.EDIT_CLINIC_ENROLLMENT,
  EDIT_DOCUMENT = DOCUMENTS + SEPARATOR + SubRoutes.EDIT_DOCUMENT,
  EDIT_MAINTENANCE = MAINTENANCE + SEPARATOR + SubRoutes.EDIT_MAINTENANCE,
  EDIT_PROFILE = PROFILE + SEPARATOR + SubRoutes.EDIT_PROFILE,
  EDIT_PROFILE_PRIVILEGES = ADMIN + SEPARATOR + SubRoutes.EDIT_PROFILE_PRIVILEGES,
  EDIT_SAIL = SAILS + SEPARATOR + SubRoutes.EDIT_SAIL,
  EDIT_SAIL_CHECKLIST = SAIL_CHECKLISTS + SEPARATOR + SubRoutes.EDIT_SAIL_CHECKLIST,
  EDIT_SAIL_MANIFEST = SAILS + SEPARATOR + SubRoutes.EDIT_SAIL_MANIFEST,
  EDIT_SAIL_PATH = SAIL_PATHS + SEPARATOR + SubRoutes.EDIT_SAIL_PATH,
  EDIT_SAIL_REQUEST = SAIL_REQUESTS + SEPARATOR + SubRoutes.EDIT_SAIL_REQUEST,
  EDIT_SOCIAL = SOCIALS + SEPARATOR + SubRoutes.EDIT_SOCIAL,
  EDIT_SOCIAL_MANIFEST = SOCIALS + SEPARATOR + SubRoutes.EDIT_SOCIAL_MANIFEST,
  EMAIL_AND_PASSWORD = LOGIN + SEPARATOR + SubRoutes.EMAIL_AND_PASSWORD,
  LIST_CHALLENGES = CHALLENGES + SEPARATOR + SubRoutes.LIST_CHALLENGES,
  LIST_CLINICS = CLINICS + SEPARATOR + SubRoutes.LIST_CLINICS,
  LIST_DOCUMENTS = DOCUMENTS + SEPARATOR + SubRoutes.LIST_DOCUMENTS,
  LIST_FEEDBACK = FEEDBACK + SEPARATOR + SubRoutes.LIST_FEEDBACK,
  LIST_MEDIA = MEDIA + SEPARATOR + SubRoutes.LIST_MEDIA,
  LIST_SAIL_CATEGORIES = ADMIN + SEPARATOR + SubRoutes.LIST_SAIL_CATEGORIES,
  LIST_SAIL_PATHS = SAIL_PATHS + SEPARATOR + SubRoutes.LIST_SAIL_PATHS,
  LIST_SOCIALS = SOCIALS + SEPARATOR + SubRoutes.LIST_SOCIALS,
  PROFILE_SETTINGS = PROFILE + SEPARATOR + SubRoutes.PROFILE_SETTINGS,
  RECORD_SAIL_PATH = SAIL_PATHS + SEPARATOR + SubRoutes.RECORD_SAIL_PATH,
  RESET_PASSWORD = LOGIN + SEPARATOR + SubRoutes.RESET_PASSWORD,
  RESOLVE_MAINTENANCE = MAINTENANCE + SEPARATOR + SubRoutes.RESOLVE_MAINTENANCE,
  SUBMIT_FEEDBACK = FEEDBACK + SEPARATOR + SubRoutes.SUBMIT_FEEDBACK,
  VIEW_BOAT = BOATS + SEPARATOR + SubRoutes.VIEW_BOAT,
  VIEW_BOAT_INSTRUCTIONS = BOAT_INSTRUCTIONS + SEPARATOR + SubRoutes.VIEW_BOAT_INSTRUCTIONS,
  VIEW_CHALLENGE = CHALLENGES + SEPARATOR + SubRoutes.VIEW_CHALLENGE,
  VIEW_CLINIC = CLINICS + SEPARATOR + SubRoutes.VIEW_CLINIC,
  VIEW_DOCUMENT = DOCUMENTS + SEPARATOR + SubRoutes.VIEW_DOCUMENT,
  VIEW_FEEDBACK = FEEDBACK + SEPARATOR + SubRoutes.VIEW_FEEDBACK,
  VIEW_MAINTENANCE = MAINTENANCE + SEPARATOR + SubRoutes.VIEW_MAINTENANCE,
  VIEW_PROFILE = PROFILE + SEPARATOR + SubRoutes.VIEW_PROFILE,
  VIEW_REQUIRED_ACTION = REQUIRED_ACTIONS + SEPARATOR + SubRoutes.VIEW_REQUIRED_ACTION,
  VIEW_SAIL = SAILS + SEPARATOR + SubRoutes.VIEW_SAIL,
  VIEW_SAIL_CHECKLIST = SAIL_CHECKLISTS + SEPARATOR + SubRoutes.VIEW_SAIL_CHECKLIST,
  VIEW_SAIL_PATH = SAIL_PATHS + SEPARATOR + SubRoutes.VIEW_SAIL_PATH,
  VIEW_SAIL_PER_PERSON = SAILS + SEPARATOR + SubRoutes.VIEW_SAIL_PER_PERSON,
  VIEW_SAIL_PICTURES = SAILS + SEPARATOR + SubRoutes.VIEW_SAIL_PICTURES,
  VIEW_SAIL_REQUEST = SAIL_REQUESTS + SEPARATOR + SubRoutes.VIEW_SAIL_REQUEST,
  VIEW_SOCIAL = SOCIALS + SEPARATOR + SubRoutes.VIEW_SOCIAL,
  VIEW_SOCIAL_PICTURES = SOCIALS + SEPARATOR + SubRoutes.VIEW_SOCIAL_PICTURES,
}

export const adminRoute = FullRoutes.ADMIN;
export const arrivalSailChecklistRoute = (id: string) => `${FullRoutes.ARRIVAL_SAIL_CHECKLIST}/${id}`;
export const boatsRoute = FullRoutes.BOATS;
export const cancelSailRoute = (sail_id: string) => `${FullRoutes.CANCEL_SAIL}/${sail_id}`;
export const cancelSocialRoute = (social_id: string) => `${FullRoutes.CANCEL_SOCIAL}/${social_id}`;
export const challengesRoute = FullRoutes.CHALLENGES;
export const clinicsRoute = FullRoutes.CLINICS;
export const createBoatRoute = FullRoutes.CREATE_BOAT;
export const createChallengeRoute = FullRoutes.CREATE_CHALLENGE;
export const createClinicRoute = FullRoutes.CREATE_CLINIC;
export const createDocumentRoute = FullRoutes.CREATE_DOCUMENT;
export const createMaintenanceRoute = FullRoutes.CREATE_MAINTENANCE;
export const createSailFromRequestRoute = (sail_request_id: string) => `${FullRoutes.CREATE_SAIL}/${sail_request_id}`;
export const createSailRequestRoute = FullRoutes.CREATE_SAIL_REQUEST;
export const createSailRoute = FullRoutes.CREATE_SAIL;
export const createSocialRoute = FullRoutes.CREATE_SOCIAL;
export const departureSailChecklistRoute = (id: string) => `${FullRoutes.DEPARTURE_SAIL_CHECKLIST}/${id}`;
export const editBoatChecklistRoute = (boat_id: string) => `${FullRoutes.EDIT_BOAT_CHECKLIST}/${boat_id}`;
export const editBoatInstructionsRoute = (boat_id: string) => `${FullRoutes.EDIT_BOAT_INSTRUCTIONS}/${boat_id}`;
export const editBoatRoute = (boat_id: string) => `${FullRoutes.EDIT_BOAT}/${boat_id}`;
export const editChallengeRoute = (challenge_id: string) => `${FullRoutes.EDIT_CHALLENGE}/${challenge_id}`;
export const editClinicEnrollmentRoute = (clinic_id: string) => `${FullRoutes.EDIT_CLINIC_ENROLLMENT}/${clinic_id}`;
export const editClinicRoute = (clinic_id: string) => `${FullRoutes.EDIT_CLINIC}/${clinic_id}`;
export const editDocumentRoute = (document_id: string) => `${FullRoutes.EDIT_DOCUMENT}/${document_id}`;
export const editMaintenanceRoute = (boat_maintenance_id: string) => `${FullRoutes.EDIT_MAINTENANCE}/${boat_maintenance_id}`;
export const editProfilePrivilegesRoute = (profile_id: string) => `${FullRoutes.EDIT_PROFILE_PRIVILEGES}/${profile_id}`;
export const editProfileRoute = (profile_id: string) => `${FullRoutes.EDIT_PROFILE}/${profile_id}`;
export const editSailChecklistRoute = (id: string) => `${FullRoutes.EDIT_SAIL_CHECKLIST}/${id}`;
export const editSailManifestRoute = (sail_id: string) => `${FullRoutes.EDIT_SAIL_MANIFEST}/${sail_id}`;
export const editSocialManifestRoute = (social_id: string) => `${FullRoutes.EDIT_SOCIAL_MANIFEST}/${social_id}`;
export const editSailPathRoute = (sailPathId: string) => `${FullRoutes.EDIT_SAIL_PATH}/${sailPathId}`;
export const editSailRequestRoute = (id: string) => `${FullRoutes.EDIT_SAIL_REQUEST}/${id}`;
export const editSailRoute = (sail_id: string) => `${FullRoutes.EDIT_SAIL}/${sail_id}`;
export const editSocialRoute = (social_id: string) => `${FullRoutes.EDIT_SOCIAL}/${social_id}`;
export const helpRoute = FullRoutes.HELP;
export const listChallengesRoute = `${FullRoutes.LIST_CHALLENGES}`;
export const listClinicsRoute = () => `${FullRoutes.LIST_CLINICS}`;
export const listDocumentsRoute = () => `${FullRoutes.LIST_DOCUMENTS}`;
export const listFeedbackRoute = (sail_id: string) => `${FullRoutes.LIST_FEEDBACK}/${sail_id}`;
export const listMediaRoute = FullRoutes.LIST_MEDIA;
export const listSailCategoriesRoute = FullRoutes.LIST_SAIL_CATEGORIES;
export const listSailPathsRoute = (sail_id: string) => `${FullRoutes.LIST_SAIL_PATHS}/${sail_id}`;
export const listSocialsRoute = () => `${FullRoutes.LIST_SOCIALS}`;
export const loginWithEmailAndPassword = FullRoutes.EMAIL_AND_PASSWORD;
export const maintenanceRoute = FullRoutes.MAINTENANCE;
export const profileSettingsRoute = FullRoutes.PROFILE_SETTINGS;
export const recordSailPathRoute = (sailPathId: string) => `${FullRoutes.RECORD_SAIL_PATH}/${sailPathId}`;
export const resetPassword = FullRoutes.RESET_PASSWORD;
export const resolveMaintenanceRoute = (boat_maintenance_id: string) => `${FullRoutes.RESOLVE_MAINTENANCE}/${boat_maintenance_id}`;
export const sailChecklistsRoute = FullRoutes.SAIL_CHECKLISTS;
export const sailRequestsRoute = FullRoutes.SAIL_REQUESTS;
export const sailsRoute = FullRoutes.SAILS;
export const socialsRoute = FullRoutes.SOCIALS;
export const submitFeedbackRoute = (sail_id: string) => `${FullRoutes.SUBMIT_FEEDBACK}/${sail_id}`;
export const viewBoatInstructionsRoute = (boat_id: string) => `${FullRoutes.VIEW_BOAT_INSTRUCTIONS}/${boat_id}`;
export const viewBoatRoute = (boat_id: string) => `${FullRoutes.VIEW_BOAT}/${boat_id}`;
export const viewChallengeRoute = (challenge_id: string) => `${FullRoutes.VIEW_CHALLENGE}/${challenge_id}`;
export const viewClinicRoute = (clinic_id: string) => `${FullRoutes.VIEW_CLINIC}/${clinic_id}`;
export const viewDocumentRoute = (document_id: string) => `${FullRoutes.VIEW_DOCUMENT}/${document_id}`;
export const viewFeedbackRoute = (feedback_id: string) => `${FullRoutes.VIEW_FEEDBACK}/${feedback_id}`;
export const viewMaintenanceRoute = (boat_maintenance_id: string) => `${FullRoutes.VIEW_MAINTENANCE}/${boat_maintenance_id}`;
export const viewProfileRoute = (profile_id: string) => `${FullRoutes.VIEW_PROFILE}/${profile_id}`;
export const viewRequiredActionRoute = (required_action_id: string) => `${FullRoutes.VIEW_REQUIRED_ACTION}/${required_action_id}`;
export const viewSailChecklistRoute = (sail_id: string) => `${FullRoutes.VIEW_SAIL_CHECKLIST}/${sail_id}`;
export const viewSailPathRoute = (sailPathId: string) => `${FullRoutes.VIEW_SAIL_PATH}/${sailPathId}`;
export const viewSailPicturesRoute = (sail_id: string) => `${FullRoutes.VIEW_SAIL_PICTURES}/${sail_id}`;
export const viewSailRequestRoute = (id: string) => `${FullRoutes.VIEW_SAIL_REQUEST}/${id}`;
export const viewSailRoute = (sail_id: string) => `${FullRoutes.VIEW_SAIL}/${sail_id}`;
export const viewSocialPicturesRoute = (social_id: string) => `${FullRoutes.VIEW_SOCIAL_PICTURES}/${social_id}`;
export const viewSocialRoute = (social_id: string) => `${FullRoutes.VIEW_SOCIAL}/${social_id}`;
export const viewUserSailsRoute = (profile_id: string) => `${FullRoutes.VIEW_SAIL_PER_PERSON}/${profile_id}`;
