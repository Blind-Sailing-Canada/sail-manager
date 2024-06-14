import { SailManifest } from '../sail-manifest/sail-manifest';
import { Sail } from '../sail/sail';
import { SailChecklist } from './sail-checklist';

export interface SailChecklistUpdateJob {
  sail: Sail,
  sail_checklist_id: string,
  updated_by_username: string,
  current_checklist: SailChecklist,
  updated_checklist: Partial<SailChecklist>,
  updated_manifest: SailManifest[],
  updated_at: string,
}
