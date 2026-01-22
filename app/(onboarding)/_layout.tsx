import { Stack } from 'expo-router';

export default function OnboardingLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        gestureEnabled: false,
        animation: 'fade_from_bottom',
        animationDuration: 250,
      }}
    >
      <Stack.Screen name="welcome" />
      <Stack.Screen name="consistency" />
      <Stack.Screen name="screen-time" />
      <Stack.Screen name="past-apps" />
      <Stack.Screen name="analyzing" options={{ animation: 'fade' }} />
      <Stack.Screen name="report" options={{ animation: 'fade' }} />
      <Stack.Screen name="solution" />
      <Stack.Screen name="activity-type" />
      <Stack.Screen name="daily-target" />
      <Stack.Screen name="health-permissions" />
      <Stack.Screen name="app-blocking" />
      <Stack.Screen name="notifications" />
      <Stack.Screen name="complete" options={{ animation: 'fade' }} />
    </Stack>
  );
}
