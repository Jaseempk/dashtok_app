import { Stack } from 'expo-router';

export default function OnboardingLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, gestureEnabled: false }}>
      <Stack.Screen name="welcome" />
      <Stack.Screen name="consistency" />
      <Stack.Screen name="screen-time" />
      <Stack.Screen name="past-apps" />
      <Stack.Screen name="analyzing" />
      <Stack.Screen name="report" />
      <Stack.Screen name="solution" />
      <Stack.Screen name="activity-type" />
      <Stack.Screen name="daily-target" />
      <Stack.Screen name="health-permissions" />
      <Stack.Screen name="notifications" />
      <Stack.Screen name="complete" />
    </Stack>
  );
}
