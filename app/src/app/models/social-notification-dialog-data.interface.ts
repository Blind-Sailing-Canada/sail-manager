import { Social } from '../../../../api/src/types/social/social';

export interface SocialNotificationDialogData {
  social: Social;
  sendSocialNotification: (notificationMessage: string, notificationType: string) => void;
}
