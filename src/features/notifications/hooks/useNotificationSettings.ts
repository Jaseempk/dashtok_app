import { useState, useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api/client';
import { queryKeys } from '@/lib/query/keys';
import { notificationService } from '../services/notificationService';
import type { NotificationPreferences } from '../types/notification.types';

interface User {
  notificationsEnabled: boolean;
  dailyReminderEnabled: boolean;
  dailyReminderTime: string;
  streakAlertsEnabled: boolean;
  weeklySummaryEnabled: boolean;
}

interface UseNotificationSettingsResult {
  preferences: NotificationPreferences;
  isUpdating: boolean;
  updatePreference: <K extends keyof NotificationPreferences>(
    key: K,
    value: NotificationPreferences[K]
  ) => Promise<void>;
  updatePreferences: (updates: Partial<NotificationPreferences>) => Promise<void>;
  syncFromServer: (user: User) => void;
}

const DEFAULT_PREFERENCES: NotificationPreferences = {
  notificationsEnabled: false,
  dailyReminderEnabled: true,
  dailyReminderTime: '08:00',
  streakAlertsEnabled: true,
  weeklySummaryEnabled: false,
};

/**
 * Hook for managing notification settings
 * Syncs preferences with server and updates local notification schedule
 */
export function useNotificationSettings(): UseNotificationSettingsResult {
  const queryClient = useQueryClient();
  const [preferences, setPreferences] = useState<NotificationPreferences>(DEFAULT_PREFERENCES);

  // Mutation for updating preferences on server
  const updateMutation = useMutation({
    mutationFn: async (updates: Partial<NotificationPreferences>) => {
      return api.patch('/users/me', updates);
    },
    onSuccess: () => {
      // Invalidate user query to refetch updated data
      queryClient.invalidateQueries({ queryKey: queryKeys.user.profile() });
    },
  });

  /**
   * Sync local state from server user data
   */
  const syncFromServer = useCallback((user: User) => {
    const serverPrefs: NotificationPreferences = {
      notificationsEnabled: user.notificationsEnabled ?? false,
      dailyReminderEnabled: user.dailyReminderEnabled ?? true,
      dailyReminderTime: user.dailyReminderTime ?? '08:00',
      streakAlertsEnabled: user.streakAlertsEnabled ?? true,
      weeklySummaryEnabled: user.weeklySummaryEnabled ?? false,
    };
    setPreferences(serverPrefs);
  }, []);

  /**
   * Update a single preference
   */
  const updatePreference = useCallback(
    async <K extends keyof NotificationPreferences>(
      key: K,
      value: NotificationPreferences[K]
    ) => {
      // Optimistic update
      const newPrefs = { ...preferences, [key]: value };
      setPreferences(newPrefs);

      try {
        // Update server (authoritative source)
        await updateMutation.mutateAsync({ [key]: value });

        // Update local notification schedule
        await notificationService.updateSchedule(newPrefs);
      } catch (error) {
        // Rollback on error
        setPreferences(preferences);
        throw error;
      }
    },
    [preferences, updateMutation]
  );

  /**
   * Update multiple preferences at once
   */
  const updatePreferences = useCallback(
    async (updates: Partial<NotificationPreferences>) => {
      // Optimistic update
      const newPrefs = { ...preferences, ...updates };
      setPreferences(newPrefs);

      try {
        // Update server (authoritative source)
        await updateMutation.mutateAsync(updates);

        // Update local notification schedule
        await notificationService.updateSchedule(newPrefs);
      } catch (error) {
        // Rollback on error
        setPreferences(preferences);
        throw error;
      }
    },
    [preferences, updateMutation]
  );

  return {
    preferences,
    isUpdating: updateMutation.isPending,
    updatePreference,
    updatePreferences,
    syncFromServer,
  };
}
