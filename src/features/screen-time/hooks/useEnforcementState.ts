import { useEffect, useRef, useCallback } from 'react';
import { AppState, Platform } from 'react-native';
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query';
import { useEnforcementStatus } from './useEnforcementStatus';
import { useBlockedApps } from './useBlockedApps';
import { useRemainingTime } from './useRemainingTime';
import { enforcementService } from '../services/enforcementService';
import { offlineQueue } from '../services/offlineQueue';
import type { EnforcementReason } from '../types/screenTime.types';

interface EnforcementState {
  isLocked: boolean;
  reason: EnforcementReason | null;
  remainingMinutes: number;
  remainingFormatted: string;
  isWarning: boolean;
  isLoading: boolean;
  hasBlockedApps: boolean;
}

/**
 * State machine hook that syncs server enforcement status with iOS blocking.
 *
 * Responsibilities:
 * 1. Fetch server status (source of truth)
 * 2. Sync iOS blocking based on server decision
 * 3. Update iOS shield content based on state
 * 4. Listen for threshold events (time exhausted)
 * 5. Refetch on app foreground
 * 6. Auto-lock when local countdown expires (immediate UX)
 * 7. Fire warning at 5 minutes remaining
 */
export function useEnforcementState(): EnforcementState {
  const queryClient = useQueryClient();
  const { data: status, isLoading: isLoadingStatus } = useEnforcementStatus();
  const { data: blockedApps, isLoading: isLoadingApps } = useBlockedApps();

  const lastSyncedState = useRef<string | null>(null);

  // Handle local countdown expiry - immediately block apps
  const handleCountdownExpire = useCallback(async () => {
    if (Platform.OS !== 'ios') return;
    if (!blockedApps?.selectionId) return;

    console.log('[useEnforcementState] Local countdown expired, blocking apps immediately');

    try {
      // Block apps immediately for instant UX
      await enforcementService.blockApps(blockedApps.selectionId);

      // Update shield to show time exhausted
      if (status?.nextUnlockRequirement) {
        await enforcementService.updateShieldForTimeExhausted(
          status.usedMinutes + status.remainingMinutes, // Total used
          Math.max(0, status.nextUnlockRequirement.target - status.nextUnlockRequirement.current),
          15,
          status.nextUnlockRequirement.unit,
          status.emergencyBypassesLeft
        );
      }

      // Sync with server (server is still source of truth)
      queryClient.invalidateQueries({ queryKey: queryKeys.enforcement.all });
    } catch (error) {
      console.error('[useEnforcementState] Auto-lock error:', error);
    }
  }, [blockedApps?.selectionId, status, queryClient]);

  // Handle 5-minute warning
  const handleWarning = useCallback(() => {
    console.log('[useEnforcementState] 5 minutes remaining warning');
    // TODO: Could trigger a toast/notification here
  }, []);

  // Live countdown with auto-lock
  const countdown = useRemainingTime(
    status?.remainingMinutes,
    status?.isUnlocked,
    {
      onExpire: handleCountdownExpire,
      onWarning: handleWarning,
    }
  );

  // Sync iOS blocking based on server status
  useEffect(() => {
    if (Platform.OS !== 'ios') return;
    if (!status || !blockedApps?.selectionId) return;

    // Create state key to prevent unnecessary syncs
    const stateKey = `${status.shouldBlock}-${status.reason}-${status.remainingMinutes}`;
    if (lastSyncedState.current === stateKey) return;
    lastSyncedState.current = stateKey;

    const syncEnforcement = async () => {
      try {
        if (status.shouldBlock) {
          // Block apps
          await enforcementService.blockApps(blockedApps.selectionId);

          // Update shield based on reason
          if (status.reason === 'goal_incomplete' && status.nextUnlockRequirement) {
            await enforcementService.updateShieldForGoalIncomplete(
              status.nextUnlockRequirement.current,
              status.nextUnlockRequirement.target,
              status.nextUnlockRequirement.unit
            );
          } else if (status.reason === 'time_exhausted' && status.nextUnlockRequirement) {
            await enforcementService.updateShieldForTimeExhausted(
              status.usedMinutes,
              Math.max(0, status.nextUnlockRequirement.target - status.nextUnlockRequirement.current),
              15, // Minutes to earn
              status.nextUnlockRequirement.unit,
              status.emergencyBypassesLeft
            );
          }
        } else if (status.reason === 'unlocked' && status.remainingMinutes > 0) {
          // Unblock apps with time limit
          await enforcementService.unblockApps(
            blockedApps.selectionId,
            status.remainingMinutes
          );
        }
      } catch (error) {
        console.error('[useEnforcementState] Sync error:', error);
      }
    };

    syncEnforcement();
  }, [status, blockedApps?.selectionId]);

  // Listen for threshold events (time exhausted notification from iOS)
  useEffect(() => {
    if (Platform.OS !== 'ios') return;

    const unsubscribe = enforcementService.onDeviceActivityEvent((event) => {
      if (event.callbackName === 'eventDidReachThreshold') {
        console.log('[useEnforcementState] Threshold reached, refetching status');
        // Invalidate to refetch - server will now return time_exhausted
        queryClient.invalidateQueries({ queryKey: queryKeys.enforcement.all });
      }
    });

    return unsubscribe;
  }, [queryClient]);

  // Refetch status on app foreground (reconciliation)
  useEffect(() => {
    const subscription = AppState.addEventListener('change', async (nextState) => {
      if (nextState === 'active') {
        // Process any queued offline events first
        try {
          const { processed } = await offlineQueue.processQueue();
          if (processed > 0) {
            console.log(`[useEnforcementState] Processed ${processed} queued events`);
          }
        } catch (error) {
          console.error('[useEnforcementState] Failed to process offline queue:', error);
        }

        // Then refresh server state
        queryClient.invalidateQueries({ queryKey: queryKeys.enforcement.all });
        queryClient.invalidateQueries({ queryKey: queryKeys.blockedApps.all });
        queryClient.invalidateQueries({ queryKey: queryKeys.usage.all });
      }
    });

    return () => subscription.remove();
  }, [queryClient]);

  const isLoading = isLoadingStatus || isLoadingApps;
  const hasBlockedApps = !!blockedApps && blockedApps.appCount > 0;

  return {
    isLocked: status?.shouldBlock ?? false,
    reason: status?.reason ?? null,
    remainingMinutes: countdown.totalSeconds > 0 ? Math.ceil(countdown.totalSeconds / 60) : 0,
    remainingFormatted: countdown.formatted,
    isWarning: countdown.isWarning,
    isLoading,
    hasBlockedApps,
  };
}
