import { AppEffects } from './app.effects';
import { BoatMaintenanceEffects } from './boat-maintenance.effects';
import { BoatEffects } from './boat.effects';
import { CDNEffects } from './cdn.effects';
import { ChallengeEffects } from './challenge.effects';
import { ClinicsEffects } from './clinics.effects';
import { FeedbackEffects } from './feedback.effects';
import { InProgressSailsEffects } from './in-progress-sails.effects';
import { InstructionsEffects } from './instructions.effects';
import { LoginEffects } from './login.effects';
import { PastSailsEffects } from './past-sails.effects';
import { ProfileEffects } from './profile.effects';
import { RequiredActionsEffects } from './required-actions.effects';
import { SailChecklistEffects } from './sail-checklist.effects';
import { SailRequestInterestEffects } from './sail-request-interest.effects';
import { SailRequestEffects } from './sail-request.effects';
import { SailEffects } from './sail.effects';
import { FutureSailsEffects } from './future-sails.effects';
import { UserAccessEffects } from './user-access.effects';
import { TodaySailsEffects } from './today-sails.effects';

export const effects = [
  AppEffects,
  BoatEffects,
  BoatMaintenanceEffects,
  CDNEffects,
  ChallengeEffects,
  ClinicsEffects,
  FeedbackEffects,
  InProgressSailsEffects,
  InstructionsEffects,
  LoginEffects,
  PastSailsEffects,
  ProfileEffects,
  RequiredActionsEffects,
  SailChecklistEffects,
  SailEffects,
  TodaySailsEffects,
  SailRequestEffects,
  SailRequestInterestEffects,
  FutureSailsEffects,
  UserAccessEffects,
];
