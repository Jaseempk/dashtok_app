/**
 * Notification Types for Dashtok
 *
 * Defines the types of notifications and their deep link targets
 */

export type NotificationType =
  | 'daily_reminder'
  | 'streak_at_risk'
  | 'goal_completed'
  | 'weekly_summary';

export interface NotificationData {
  type: NotificationType;
  deepLink?: string;
  // Additional type-specific data
  streakDays?: number;
  goalName?: string;
  screenTimeEarned?: number;
}

export interface NotificationContent {
  title: string;
  body: string;
  data?: NotificationData;
}

export interface NotificationPreferences {
  notificationsEnabled: boolean;
  dailyReminderEnabled: boolean;
  dailyReminderTime: string; // HH:MM format
  streakAlertsEnabled: boolean;
  weeklySummaryEnabled: boolean;
}

export interface ScheduledNotification {
  id: string;
  type: NotificationType;
  scheduledTime: Date;
}

// Deep link mappings for notification types
export const NOTIFICATION_DEEP_LINKS: Record<NotificationType, string> = {
  daily_reminder: 'dashtok://home',
  streak_at_risk: 'dashtok://home',
  goal_completed: 'dashtok://activities',
  weekly_summary: 'dashtok://profile',
};

// Notification content templates
export const NOTIFICATION_TEMPLATES: Record<
  NotificationType,
  { title: string; bodyTemplate: string }
> = {
  daily_reminder: {
    title: 'Morning kick-off',
    bodyTemplate: "Sun's up! Let's hit that goal today.",
  },
  streak_at_risk: {
    title: 'Streak at risk',
    bodyTemplate: "Don't break your {{streakDays}}-day streak!",
  },
  goal_completed: {
    title: 'Goal crushed!',
    bodyTemplate: 'You earned {{screenTimeEarned}} min screen time.',
  },
  weekly_summary: {
    title: 'Weekly stats ready',
    bodyTemplate: 'Your weekly activity summary is here!',
  },
};
