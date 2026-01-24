import { View, Text } from 'react-native';
import { Stack, useSegments } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ProgressSteps } from '@/features/onboarding/components';

// Routes that show progress bar with their step numbers
const PROGRESS_ROUTES: Record<string, { step: number; total: number }> = {
  'fitness-habits': { step: 1, total: 5 },
  'behavior-1': { step: 2, total: 5 },
  'behavior-2': { step: 3, total: 5 },
  'behavior-3': { step: 4, total: 5 },
  'behavior-4': { step: 5, total: 5 },
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
      {/* Persistent Progress Bar - only for behavior screens */}
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
        {/* New flow screens */}
        <Stack.Screen name="welcome" />
        <Stack.Screen name="about-you" />
        <Stack.Screen name="health-permissions" />
        <Stack.Screen name="fitness-habits" />
        <Stack.Screen name="behavior-1" />
        <Stack.Screen name="behavior-2" />
        <Stack.Screen name="behavior-3" />
        <Stack.Screen name="behavior-4" />
        <Stack.Screen name="activity-type" />
        <Stack.Screen name="analyzing" options={{ animation: 'fade' }} />
        <Stack.Screen name="profile-result" options={{ animation: 'fade' }} />
        <Stack.Screen name="goal-recommendation" />
        <Stack.Screen name="app-blocking" />
        <Stack.Screen name="notifications" />
        <Stack.Screen name="complete" options={{ animation: 'fade' }} />
      </Stack>
    </View>
  );
}
