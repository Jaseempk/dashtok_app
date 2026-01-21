import { useEffect, useRef } from 'react';
import * as Notifications from 'expo-notifications';
import { notificationService } from '../services/notificationService';

/**
 * Hook for setting up notification listeners
 * Should be used at the app root level (_layout.tsx)
 *
 * Handles:
 * - Foreground notification display
 * - Notification tap/response handling
 * - Last notification response (cold start)
 */
export function useNotifications(): void {
  const notificationListener = useRef<Notifications.Subscription | null>(null);
  const responseListener = useRef<Notifications.Subscription | null>(null);

  useEffect(() => {
    // Handle notifications received while app is in foreground
    notificationListener.current = Notifications.addNotificationReceivedListener(
      (notification) => {
        notificationService.handleNotificationReceived(notification);
      }
    );

    // Handle notification taps (user interaction)
    responseListener.current = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        notificationService.handleNotificationResponse(response);
      }
    );

    // Handle notification that opened the app (cold start)
    Notifications.getLastNotificationResponseAsync().then((response) => {
      if (response) {
        console.log('[useNotifications] App opened from notification');
        notificationService.handleNotificationResponse(response);
      }
    });

    // Cleanup listeners on unmount
    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(notificationListener.current);
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, []);
}
