import { View, Text } from 'react-native';
import { Stack, useSegments } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ProgressSteps } from '@/features/onboarding/components';

// Routes that show progress bar with their step numbers
const PROGRESS_ROUTES: Record<string, { step: number; total: number }> = {
  consistency: { step: 1, total: 6 },
  'screen-time': { step: 2, total: 6 },
  'past-apps': { step: 3, total: 6 },
};

export default function OnboardingLayout() {
  const segments = useSegments();
  const insets = useSafeAreaInsets();

  // Get current route name (last segment in onboarding group)
  const currentRoute = segments[segments.length - 1] ?? '';
  const progressConfig = PROGRESS_ROUTES[currentRoute];
  const showProgress = !!progressConfig;

  return (
    <View className="flex-1 bg-background-primary">
      {/* Persistent Progress Bar - only for MCQ screens */}
      {showProgress && (
        <View
          className="px-6 pt-4 bg-background-primary"
          style={{ paddingTop: insets.top + 16 }}
        >
          <View className="flex-row items-center justify-center mb-4">
            <Text className="text-sm font-medium text-primary-500 tracking-wide">
              Step {progressConfig.step} of {progressConfig.total}
            </Text>
          </View>
          <ProgressSteps
            current={progressConfig.step}
            total={progressConfig.total}
          />
        </View>
      )}

      <Stack
        screenOptions={{
          headerShown: false,
          gestureEnabled: false,
          animation: 'fade_from_bottom',
          animationDuration: 250,
          contentStyle: { backgroundColor: 'transparent' },
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
    </View>
  );
}
