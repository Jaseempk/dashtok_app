import { Stack } from 'expo-router';
import { useNotifications } from '@/features/notifications';

export default function AppLayout() {
  // Set up notification listeners (foreground, tap, cold start)
  useNotifications();
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="log-activity" options={{ presentation: 'modal' }} />
      <Stack.Screen name="create-goal" options={{ presentation: 'modal' }} />
      <Stack.Screen name="screen-time" options={{ presentation: 'modal' }} />
      <Stack.Screen name="streak" options={{ presentation: 'modal' }} />
    </Stack>
  );
}
