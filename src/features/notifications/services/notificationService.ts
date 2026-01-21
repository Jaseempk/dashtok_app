import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { router } from 'expo-router';
import { api } from '@/lib/api/client';
import type {
  NotificationType,
  NotificationData,
  NotificationContent,
  NotificationPreferences,
} from '../types/notification.types';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

class NotificationService {
  private pushToken: string | null = null;

  /**
   * Request notification permissions from the OS
   * Returns true if granted, false otherwise
   */
  async requestPermission(): Promise<boolean> {
    try {
      // Check if we're on a physical device
      if (!Device.isDevice) {
        console.warn('[Notifications] Must use physical device for push notifications');
        return false;
      }

      // Check current permission status
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      // Request permission if not already granted
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.log('[Notifications] Permission not granted');
        return false;
      }

      // Set up Android notification channel
      if (Platform.OS === 'android') {
        await this.setupAndroidChannel();
      }

      console.log('[Notifications] Permission granted');
      return true;
    } catch (error) {
      console.error('[Notifications] requestPermission error:', error);
      return false;
    }
  }

  /**
   * Get the current permission status
   */
  async getPermissionStatus(): Promise<'granted' | 'denied' | 'undetermined'> {
    try {
      const { status } = await Notifications.getPermissionsAsync();
      return status === 'granted' ? 'granted' : status === 'denied' ? 'denied' : 'undetermined';
    } catch (error) {
      console.error('[Notifications] getPermissionStatus error:', error);
      return 'undetermined';
    }
  }

  /**
   * Get Expo push token for server-side notifications
   */
  async getPushToken(): Promise<string | null> {
    try {
      if (!Device.isDevice) {
        console.warn('[Notifications] Push tokens require physical device');
        return null;
      }

      const tokenData = await Notifications.getExpoPushTokenAsync({
        projectId: 'ed964bb4-0806-416c-8f41-28b4c3aa774f', // From app.json
      });

      this.pushToken = tokenData.data;
      console.log('[Notifications] Push token:', this.pushToken);
      return this.pushToken;
    } catch (error) {
      console.error('[Notifications] getPushToken error:', error);
      return null;
    }
  }

  /**
   * Register push token with backend
   * Server validates token format before storing
   */
  async registerTokenWithServer(token: string): Promise<boolean> {
    try {
      await api.post('/users/me/push-token', { token });
      console.log('[Notifications] Token registered with server');
      return true;
    } catch (error) {
      console.error('[Notifications] registerTokenWithServer error:', error);
      return false;
    }
  }

  /**
   * Remove push token from server (on logout or disable)
   */
  async removeTokenFromServer(): Promise<boolean> {
    try {
      await api.delete('/users/me/push-token');
      console.log('[Notifications] Token removed from server');
      return true;
    } catch (error) {
      console.error('[Notifications] removeTokenFromServer error:', error);
      return false;
    }
  }

  /**
   * Schedule a local notification
   */
  async scheduleNotification(
    content: NotificationContent,
    trigger: Notifications.NotificationTriggerInput
  ): Promise<string | null> {
    try {
      const id = await Notifications.scheduleNotificationAsync({
        content: {
          title: content.title,
          body: content.body,
          data: content.data as unknown as Record<string, unknown>,
          sound: true,
        },
        trigger,
      });
      console.log('[Notifications] Scheduled notification:', id);
      return id;
    } catch (error) {
      console.error('[Notifications] scheduleNotification error:', error);
      return null;
    }
  }

  /**
   * Schedule daily reminder notification
   */
  async scheduleDailyReminder(time: string): Promise<string | null> {
    const [hours, minutes] = time.split(':').map(Number);

    return this.scheduleNotification(
      {
        title: 'Morning kick-off',
        body: "Sun's up! Let's hit that goal today.",
        data: {
          type: 'daily_reminder' as NotificationType,
          deepLink: 'dashtok://home',
        },
      },
      {
        type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
        hour: hours,
        minute: minutes,
        repeats: true,
      }
    );
  }

  /**
   * Send streak at risk notification (called when goal not met)
   * Note: This should primarily be triggered by server push notifications,
   * not scheduled locally, since the server has authoritative goal progress data.
   * This method is for immediate display when server sends push or for testing.
   */
  async sendStreakAlert(streakDays: number): Promise<string | null> {
    return this.scheduleNotification(
      {
        title: 'Streak at risk',
        body: `Don't break your ${streakDays}-day streak!`,
        data: {
          type: 'streak_at_risk' as NotificationType,
          deepLink: 'dashtok://home',
          streakDays,
        },
      },
      null // Immediate, not scheduled - server determines when to send
    );
  }

  /**
   * Send immediate goal completed notification
   */
  async sendGoalCompletedNotification(
    goalName: string,
    screenTimeEarned: number
  ): Promise<string | null> {
    return this.scheduleNotification(
      {
        title: 'Goal crushed!',
        body: `You earned ${screenTimeEarned} min screen time.`,
        data: {
          type: 'goal_completed' as NotificationType,
          deepLink: 'dashtok://activities',
          goalName,
          screenTimeEarned,
        },
      },
      null // Immediate
    );
  }

  /**
   * Schedule weekly summary notification (Sunday)
   */
  async scheduleWeeklySummary(): Promise<string | null> {
    return this.scheduleNotification(
      {
        title: 'Weekly stats ready',
        body: 'Your weekly activity summary is here!',
        data: {
          type: 'weekly_summary' as NotificationType,
          deepLink: 'dashtok://profile',
        },
      },
      {
        type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
        weekday: 1, // Sunday (1 = Sunday in Expo)
        hour: 10,
        minute: 0,
        repeats: true,
      }
    );
  }

  /**
   * Cancel a specific scheduled notification
   */
  async cancelNotification(id: string): Promise<void> {
    try {
      await Notifications.cancelScheduledNotificationAsync(id);
      console.log('[Notifications] Cancelled notification:', id);
    } catch (error) {
      console.error('[Notifications] cancelNotification error:', error);
    }
  }

  /**
   * Cancel all scheduled notifications
   */
  async cancelAllNotifications(): Promise<void> {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      console.log('[Notifications] Cancelled all notifications');
    } catch (error) {
      console.error('[Notifications] cancelAllNotifications error:', error);
    }
  }

  /**
   * Get all scheduled notifications
   */
  async getScheduledNotifications(): Promise<Notifications.NotificationRequest[]> {
    try {
      return await Notifications.getAllScheduledNotificationsAsync();
    } catch (error) {
      console.error('[Notifications] getScheduledNotifications error:', error);
      return [];
    }
  }

  /**
   * Handle notification received while app is in foreground
   */
  handleNotificationReceived(notification: Notifications.Notification): void {
    console.log('[Notifications] Received in foreground:', notification);
    // Could show in-app toast here if desired
  }

  /**
   * Handle notification tap (user interaction)
   * Routes to appropriate screen based on notification data
   */
  handleNotificationResponse(response: Notifications.NotificationResponse): void {
    const data = response.notification.request.content.data as NotificationData | undefined;
    console.log('[Notifications] User tapped notification:', data);

    if (!data?.deepLink) {
      return;
    }

    // Parse deep link and navigate
    // Deep links: dashtok://home, dashtok://activities, dashtok://profile
    const path = data.deepLink.replace('dashtok://', '/');

    try {
      // Map deep link paths to actual routes
      switch (path) {
        case '/home':
          router.replace('/(app)/(tabs)' as const);
          break;
        case '/activities':
          router.replace('/(app)/(tabs)/activities' as const);
          break;
        case '/profile':
          router.replace('/(app)/(tabs)/profile' as const);
          break;
        default:
          console.warn('[Notifications] Unknown deep link path:', path);
      }
    } catch (error) {
      console.error('[Notifications] Navigation error:', error);
    }
  }

  /**
   * Set up Android notification channel
   */
  private async setupAndroidChannel(): Promise<void> {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'Default',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#00f5d4',
    });
  }

  /**
   * Update notification schedule based on preferences
   * Called when preferences change
   *
   * LOCAL notifications (scheduled on device):
   * - Daily reminders: Repeating at user's preferred time
   * - Weekly summary: Repeating on Sundays at 10 AM
   *
   * SERVER-SENT notifications (via Expo Push):
   * - Streak alerts: Server checks goal progress and sends if needed
   * - Goal completed: Server sends after activity syncs
   */
  async updateSchedule(preferences: NotificationPreferences): Promise<void> {
    // Cancel all existing scheduled notifications
    await this.cancelAllNotifications();

    if (!preferences.notificationsEnabled) {
      console.log('[Notifications] Notifications disabled, cleared schedule');
      return;
    }

    // Schedule daily reminder if enabled (LOCAL)
    if (preferences.dailyReminderEnabled) {
      await this.scheduleDailyReminder(preferences.dailyReminderTime);
    }

    // Schedule weekly summary if enabled (LOCAL)
    if (preferences.weeklySummaryEnabled) {
      await this.scheduleWeeklySummary();
    }

    // Note: Streak alerts are SERVER-SENT based on actual goal progress
    // The server runs cron jobs to check user progress and send push notifications

    console.log('[Notifications] Schedule updated based on preferences');
  }
}

export const notificationService = new NotificationService();
