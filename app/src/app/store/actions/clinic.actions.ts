import {
  createAction,
  props,
} from '@ngrx/store';
import { Clinic } from '../../../../../api/src/types/clinic/clinic';

export enum CLINIC_ACTION_TYPES {
  ADD_USER_TO_CLINIC = '[Clinics] Add user to clinic',
  CREATE_CLINIC = '[Clinics] Create clinic',
  ENROLL_IN_CLINIC = '[Clinics] Enroll clinic',
  FETCH_CLINIC = '[Clinics] Fetch clinic',
  FETCH_CLINICS = '[Clinics] Fetch clinics',
  GRADUATE_USER_FROM_CLINIC = '[Clinics] Graduate user from clinic',
  LEAVE_CLINIC = '[Clinics] Leave clinic',
  PUT_CLINIC = '[Clinics] Put clinic',
  PUT_CLINICS = '[Clinics] Put clinics',
  REMOVE_USER_FROM_CLINIC = '[Clinics] Remove user from clinic',
  RESET = 'Reset',
  UPDATE_CLINIC = '[Clinics] Update clinic',
}

export const addUserToClinic = createAction(
  CLINIC_ACTION_TYPES.ADD_USER_TO_CLINIC, props<{ clinicId: string; profile_id: string; notify?: boolean }>());
export const createClinic = createAction(CLINIC_ACTION_TYPES.CREATE_CLINIC, props<{ clinic: Partial<Clinic>; notify?: boolean }>());
export const fetchClinic = createAction(CLINIC_ACTION_TYPES.FETCH_CLINIC, props<{ clinicId: string; notify?: boolean }>());
export const fetchClinics = createAction(CLINIC_ACTION_TYPES.FETCH_CLINICS, props<{ query?: string; notify?: boolean }>());
export const resetClinics = createAction(CLINIC_ACTION_TYPES.RESET);
export const graduateUserFromClinic = createAction(
  CLINIC_ACTION_TYPES.GRADUATE_USER_FROM_CLINIC, props<{ clinicId: string; profile_id: string; notify?: boolean }>());
export const removeUserFromClinic = createAction(
  CLINIC_ACTION_TYPES.REMOVE_USER_FROM_CLINIC, props<{ clinicId: string; profile_id: string; notify?: boolean }>());
export const updateClinic = createAction(
  CLINIC_ACTION_TYPES.UPDATE_CLINIC, props<{ clinicId: string; clinic: Partial<Clinic>; notify?: boolean }>());
export const putClinic = createAction(CLINIC_ACTION_TYPES.PUT_CLINIC, props<{ clinicId: string; clinic: Clinic }>());
export const putClinics = createAction(CLINIC_ACTION_TYPES.PUT_CLINICS, props<{ clinics: Clinic[] }>());
export const enrollInClinic = createAction(
  CLINIC_ACTION_TYPES.ENROLL_IN_CLINIC, props<{ clinicId: string; profile_id: string; notify?: boolean }>());
export const leaveClinic = createAction(
  CLINIC_ACTION_TYPES.LEAVE_CLINIC, props<{ clinicId: string; profile_id: string; notify?: boolean }>());
