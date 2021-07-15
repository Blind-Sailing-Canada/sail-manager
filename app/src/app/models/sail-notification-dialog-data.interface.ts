import { Sail } from '../../../../api/src/types/sail/sail';

export interface SailNotificationDialogData {
  sail: Sail;
  sendSailNotification: (notificationMessage: string, notificationType: string) => void;
}
