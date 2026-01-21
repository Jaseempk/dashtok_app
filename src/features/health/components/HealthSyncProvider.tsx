import { useEffect, useRef, ReactNode } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { useAuth } from '@clerk/clerk-expo';
import { useOnboardingStore } from '@/features/onboarding/store/onboardingStore';
import { useHealthSync } from '../hooks/useHealthSync';

interface HealthSyncProviderProps {
  children: ReactNode;
}

/**
 * Provider that automatically syncs health data when app comes to foreground
 * Only syncs if user is authenticated and has connected health data
 */
export function HealthSyncProvider({ children }: HealthSyncProviderProps) {
  const { isSignedIn } = useAuth();
  const healthConnected = useOnboardingStore((state) => state.healthConnected);
  const { syncToday, isSyncing } = useHealthSync();
  const lastSyncRef = useRef<number>(0);

  useEffect(() => {
    // Don't sync if not signed in or health not connected
    if (!isSignedIn || !healthConnected) return;

    const handleAppStateChange = async (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active') {
        // Throttle syncs to at most once per 5 minutes
        const now = Date.now();
        const fiveMinutes = 5 * 60 * 1000;

        if (now - lastSyncRef.current < fiveMinutes) {
          return;
        }

        if (isSyncing) return;

        try {
          lastSyncRef.current = now;
          await syncToday();
        } catch (error) {
          console.error('[HealthSyncProvider] Sync error:', error);
        }
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    // Initial sync on mount if coming from background
    if (AppState.currentState === 'active') {
      handleAppStateChange('active');
    }

    return () => {
      subscription.remove();
    };
  }, [isSignedIn, healthConnected, syncToday, isSyncing]);

  return <>{children}</>;
}
