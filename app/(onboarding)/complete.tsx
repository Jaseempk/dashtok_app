import { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '@/components/ui';
import { useOnboardingStore } from '@/features/onboarding/store/onboardingStore';
import { api } from '@/lib/api/client';

type SubmitState = 'idle' | 'loading' | 'success' | 'error';

export default function CompleteScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [submitState, setSubmitState] = useState<SubmitState>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { activityType, dailyTargetKm, reset } = useOnboardingStore();

  // Calculate screen time reward based on activity and distance
  const getScreenTimeReward = () => {
    const baseMinutes = activityType === 'run' ? 45 : activityType === 'walk' ? 20 : 30;
    const multiplier = dailyTargetKm / 2;
    return Math.round(baseMinutes * multiplier);
  };

  const handleComplete = async () => {
    setSubmitState('loading');
    setErrorMessage(null);

    try {
      // Create the goal
      await api.post('/goals', {
        goalType: 'daily',
        activityType: activityType || 'walk',
        targetValue: dailyTargetKm,
        targetUnit: 'km',
        rewardMinutes: getScreenTimeReward(),
      });

      // Mark onboarding as complete
      await api.patch('/users/me', {
        onboardingCompleted: true,
      });

      setSubmitState('success');

      // Reset onboarding state
      reset();
    } catch (error) {
      setSubmitState('error');
      setErrorMessage(
        error instanceof Error ? error.message : 'Something went wrong. Please try again.'
      );
    }
  };

  const handleGoToDashboard = () => {
    router.replace('/(app)/(tabs)' as const);
  };

  // Auto-submit on mount
  useEffect(() => {
    handleComplete();
  }, []);

  return (
    <View
      className="flex-1 bg-background-primary justify-center"
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
    >
      <View className="flex-1 justify-center items-center px-6">
        {submitState === 'loading' && (
          <>
            <ActivityIndicator size="large" color="#00f5d4" />
            <Text className="text-lg text-gray-400 mt-6 text-center">
              Setting up your goal...
            </Text>
          </>
        )}

        {submitState === 'success' && (
          <>
            {/* Success Animation Placeholder */}
            <View className="w-32 h-32 rounded-full bg-primary-500/20 items-center justify-center mb-6">
              <Text className="text-6xl">🎉</Text>
            </View>

            <Text className="text-4xl font-bold text-white text-center mb-3">
              You're all set!
            </Text>
            <Text className="text-base text-gray-400 text-center mb-2">
              Your first goal is ready:
            </Text>

            {/* Goal Summary Card */}
            <View className="w-full rounded-2xl bg-background-secondary border border-primary-500/30 p-6 mt-4 mb-8">
              <View className="flex-row items-center justify-between mb-4">
                <View>
                  <Text className="text-sm text-gray-500 uppercase tracking-wider mb-1">
                    Daily Target
                  </Text>
                  <Text className="text-3xl font-bold text-white">
                    {dailyTargetKm} km
                  </Text>
                </View>
                <View className="w-16 h-16 rounded-full bg-primary-500/20 items-center justify-center">
                  <Text className="text-3xl">
                    {activityType === 'run' ? '🏃' : activityType === 'walk' ? '🚶' : '💪'}
                  </Text>
                </View>
              </View>

              <View className="h-px bg-border-subtle mb-4" />

              <View className="flex-row items-center gap-2">
                <Text className="text-primary-500">📱</Text>
                <Text className="text-gray-400">
                  Earn{' '}
                  <Text className="text-primary-500 font-semibold">
                    {getScreenTimeReward()} min
                  </Text>{' '}
                  of screen time
                </Text>
              </View>
            </View>

            <Text className="text-sm text-gray-500 text-center">
              Complete your first activity to{'\n'}start earning screen time!
            </Text>
          </>
        )}

        {submitState === 'error' && (
          <>
            <View className="w-24 h-24 rounded-full bg-red-500/20 items-center justify-center mb-6">
              <Text className="text-5xl">😔</Text>
            </View>

            <Text className="text-2xl font-bold text-white text-center mb-2">
              Something went wrong
            </Text>
            <Text className="text-base text-gray-400 text-center mb-6">
              {errorMessage}
            </Text>

            <Button onPress={handleComplete} variant="secondary">
              Try Again
            </Button>
          </>
        )}
      </View>

      {/* Footer */}
      {submitState === 'success' && (
        <View className="px-6 pb-4">
          <Button onPress={handleGoToDashboard}>
            Go to Dashboard
          </Button>
        </View>
      )}
    </View>
  );
}
