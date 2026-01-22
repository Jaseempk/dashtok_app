import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { useNotifications } from '@/features/notifications';
import { useEnforcementState } from '@/features/screen-time';

// Screens that should NOT trigger lock redirect
const EXEMPT_SCREENS = [
  'goal-incomplete-lock',
  'time-exhausted-lock',
  'manage-blocked-apps',
  'screen-time',
];

export default function AppLayout() {
  const router = useRouter();
  const segments = useSegments();
  const { isLocked, reason, hasBlockedApps, isLoading } = useEnforcementState();

  // Set up notification listeners (foreground, tap, cold start)
  useNotifications();

  // Redirect to lock screen when enforcement is active
  useEffect(() => {
    if (isLoading || !hasBlockedApps) return;

    // Get current screen name
    const currentScreen = segments[segments.length - 1] ?? '';

    // Don't redirect if already on an exempt screen
    if (EXEMPT_SCREENS.includes(currentScreen)) return;

    // Redirect based on lock reason
    if (isLocked && reason === 'goal_incomplete') {
      router.replace('/(app)/goal-incomplete-lock');
    } else if (isLocked && reason === 'time_exhausted') {
      router.replace('/(app)/time-exhausted-lock');
    }
  }, [isLocked, reason, hasBlockedApps, isLoading, segments, router]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="log-activity" options={{ presentation: 'modal' }} />
      <Stack.Screen name="create-goal" options={{ presentation: 'modal' }} />
      <Stack.Screen name="screen-time" options={{ presentation: 'modal' }} />
      <Stack.Screen name="streak" options={{ presentation: 'modal' }} />
      <Stack.Screen name="manage-blocked-apps" options={{ presentation: 'modal' }} />
      <Stack.Screen name="goal-incomplete-lock" options={{ gestureEnabled: false }} />
      <Stack.Screen name="time-exhausted-lock" options={{ gestureEnabled: false }} />
    </Stack>
  );
}
