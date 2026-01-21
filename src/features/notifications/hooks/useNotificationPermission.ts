import { useState, useCallback, useEffect } from 'react';
import { notificationService } from '../services/notificationService';

type PermissionStatus = 'granted' | 'denied' | 'undetermined' | 'loading';

interface UseNotificationPermissionResult {
  status: PermissionStatus;
  isLoading: boolean;
  requestPermission: () => Promise<boolean>;
  checkPermission: () => Promise<void>;
}

/**
 * Hook for managing notification permissions
 * Handles permission request and status tracking
 */
export function useNotificationPermission(): UseNotificationPermissionResult {
  const [status, setStatus] = useState<PermissionStatus>('loading');
  const [isLoading, setIsLoading] = useState(false);

  // Check permission status on mount
  useEffect(() => {
    checkPermission();
  }, []);

  const checkPermission = useCallback(async () => {
    try {
      const currentStatus = await notificationService.getPermissionStatus();
      setStatus(currentStatus);
    } catch (error) {
      console.error('[useNotificationPermission] checkPermission error:', error);
      setStatus('undetermined');
    }
  }, []);

  const requestPermission = useCallback(async (): Promise<boolean> => {
    setIsLoading(true);
    try {
      const granted = await notificationService.requestPermission();
      setStatus(granted ? 'granted' : 'denied');

      if (granted) {
        // Get and register push token with server
        const token = await notificationService.getPushToken();
        if (token) {
          await notificationService.registerTokenWithServer(token);
        }
      }

      return granted;
    } catch (error) {
      console.error('[useNotificationPermission] requestPermission error:', error);
      setStatus('denied');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    status,
    isLoading,
    requestPermission,
    checkPermission,
  };
}
