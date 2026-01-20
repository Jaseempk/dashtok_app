import { Stack } from 'expo-router';

export default function AuthLayout() {
  // AuthGuard in Providers handles redirecting signed-in users away from auth screens
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#0a0f1a' },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="sign-in" />
      <Stack.Screen name="sign-up" />
      <Stack.Screen name="verify-email" />
    </Stack>
  );
}
