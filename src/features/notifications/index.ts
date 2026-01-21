// Services
export { notificationService } from './services/notificationService';

// Hooks
export { useNotificationPermission } from './hooks/useNotificationPermission';
export { useNotifications } from './hooks/useNotifications';
export { useNotificationSettings } from './hooks/useNotificationSettings';

// Types
export type {
  NotificationType,
  NotificationData,
  NotificationContent,
  NotificationPreferences,
  ScheduledNotification,
} from './types/notification.types';

export {
  NOTIFICATION_DEEP_LINKS,
  NOTIFICATION_TEMPLATES,
} from './types/notification.types';
