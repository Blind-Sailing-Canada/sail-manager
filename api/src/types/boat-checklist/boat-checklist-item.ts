import { BoatChecklistItemType } from './boat-checklist-item-type';

export interface BoatChecklistItem {
  defaultValue: string
  key: string
  label: string
  options: string //comma separated
  type: BoatChecklistItemType
}

