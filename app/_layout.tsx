import { Stack } from 'expo-router';

export default function RootLayout() {
  // TODO: Add providers (Clerk, QueryClient, etc.)
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(onboarding)" />
      <Stack.Screen name="(app)" />
    </Stack>
  );
}
