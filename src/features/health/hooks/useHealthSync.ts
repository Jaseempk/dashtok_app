import { useState, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { healthService } from '../services/healthService';
import { activitiesApi } from '@/features/activities/api/activitiesApi';
import { queryKeys } from '@/lib/query/keys';
import { mmkv } from '@/lib/storage/mmkv';
import type { HealthActivity, SyncResult } from '../types/health.types';

const LAST_SYNC_KEY = 'health_last_sync';
const SYNC_LOOKBACK_DAYS = 7;

interface UseHealthSyncResult {
  isSyncing: boolean;
  lastSyncedAt: Date | null;
  lastSyncResult: SyncResult | null;
  sync: () => Promise<SyncResult>;
  syncToday: () => Promise<SyncResult>;
}

export function useHealthSync(): UseHealthSyncResult {
  const queryClient = useQueryClient();
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(() => {
    const stored = mmkv.getString(LAST_SYNC_KEY);
    return stored ? new Date(stored) : null;
  });
  const [lastSyncResult, setLastSyncResult] = useState<SyncResult | null>(null);

  const syncActivities = useCallback(
    async (activities: HealthActivity[]): Promise<SyncResult> => {
      const result: SyncResult = { synced: 0, skipped: 0, failed: 0 };

      for (const activity of activities) {
        try {
          await activitiesApi.createActivity({
            activityType: activity.activityType,
            distanceMeters: activity.distanceMeters,
            durationSeconds: activity.durationSeconds,
            steps: activity.steps,
            calories: activity.calories,
            startedAt: activity.startedAt.toISOString(),
            endedAt: activity.endedAt.toISOString(),
            source: 'healthkit',
            healthkitId: activity.id,
          });
          result.synced++;
        } catch (error: any) {
          // Check if it's a duplicate error (already synced)
          if (error?.message?.includes('duplicate') || error?.status === 409) {
            result.skipped++;
          } else {
            console.error('[useHealthSync] Sync activity error:', error);
            result.failed++;
          }
        }
      }

      return result;
    },
    []
  );

  const sync = useCallback(async (): Promise<SyncResult> => {
    setIsSyncing(true);
    try {
      // Get activities from the last N days
      const activities = await healthService.getRecentActivities(SYNC_LOOKBACK_DAYS);

      if (activities.length === 0) {
        const result = { synced: 0, skipped: 0, failed: 0 };
        setLastSyncResult(result);
        return result;
      }

      const result = await syncActivities(activities);

      // Update last sync time
      const now = new Date();
      setLastSyncedAt(now);
      mmkv.setString(LAST_SYNC_KEY, now.toISOString());

      setLastSyncResult(result);

      // Invalidate relevant queries to refresh UI
      if (result.synced > 0) {
        await queryClient.invalidateQueries({ queryKey: queryKeys.activities.all });
        await queryClient.invalidateQueries({ queryKey: queryKeys.allowances.today() });
        await queryClient.invalidateQueries({ queryKey: queryKeys.streaks.current() });
      }

      return result;
    } finally {
      setIsSyncing(false);
    }
  }, [syncActivities, queryClient]);

  const syncToday = useCallback(async (): Promise<SyncResult> => {
    setIsSyncing(true);
    try {
      const activities = await healthService.getTodayActivities();

      if (activities.length === 0) {
        const result = { synced: 0, skipped: 0, failed: 0 };
        setLastSyncResult(result);
        return result;
      }

      const result = await syncActivities(activities);

      // Update last sync time
      const now = new Date();
      setLastSyncedAt(now);
      mmkv.setString(LAST_SYNC_KEY, now.toISOString());

      setLastSyncResult(result);

      // Invalidate relevant queries to refresh UI
      if (result.synced > 0) {
        await queryClient.invalidateQueries({ queryKey: queryKeys.activities.all });
        await queryClient.invalidateQueries({ queryKey: queryKeys.allowances.today() });
        await queryClient.invalidateQueries({ queryKey: queryKeys.streaks.current() });
      }

      return result;
    } finally {
      setIsSyncing(false);
    }
  }, [syncActivities, queryClient]);

  return {
    isSyncing,
    lastSyncedAt,
    lastSyncResult,
    sync,
    syncToday,
  };
}
