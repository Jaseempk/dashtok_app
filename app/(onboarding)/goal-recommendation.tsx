import { useRef } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Button, Icon } from '@/components/ui';
import { OnboardingHeader, DistanceSlider } from '@/features/onboarding/components';
import { useOnboardingStore } from '@/features/onboarding/store/onboardingStore';

export default function GoalRecommendationScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const lastHapticValue = useRef<number>(0);

  const {
    activityType,
    dailyTargetKm,
    goalRecommendation,
    userAdjustedGoal,
    setDailyTargetKm,
    setUserAdjustedGoal,
  } = useOnboardingStore();

  const suggestedDistance = goalRecommendation?.suggestedDistanceKm ?? 2.0;
  const reasoning = goalRecommendation?.reasoning ?? 'Based on your profile and fitness level.';

  // Calculate reward minutes
  const rewardRate = activityType === 'run' ? 22 : 15;
  const rewardMinutes = Math.round(dailyTargetKm * rewardRate);

  const handleSliderChange = (value: number) => {
    // Haptic on step change
    if (Math.abs(value - lastHapticValue.current) >= 0.5) {
      Haptics.selectionAsync();
      lastHapticValue.current = value;
    }

    setDailyTargetKm(value);
    setUserAdjustedGoal(Math.abs(value - suggestedDistance) > 0.1);
  };

  const handleContinue = () => {
    router.push('/(onboarding)/app-blocking');
  };

  // Calculate delta from suggested
  const delta = dailyTargetKm - suggestedDistance;
  const deltaText = delta > 0 ? `+${delta.toFixed(1)} km` : delta < 0 ? `${delta.toFixed(1)} km` : null;

  return (
    <View
      className="flex-1 bg-background-primary"
      style={{ paddingTop: insets.top }}
    >
      <OnboardingHeader step={6} total={7} />

      <ScrollView
        className="flex-1"
        contentContainerClassName="px-6 pb-32"
        showsVerticalScrollIndicator={false}
      >
        {/* Title */}
        <Text className="text-3xl font-bold text-white mb-2">
          Your personalized{'\n'}daily goal
        </Text>
        <Text className="text-base text-gray-400 mb-8">
          AI-recommended based on your profile. Adjust if needed.
        </Text>

        {/* Current Value Display */}
        <View className="items-center mb-6">
          <View className="w-40 h-40 rounded-full bg-background-secondary border-4 border-primary-500 items-center justify-center">
            <Text className="text-5xl font-bold text-white">{dailyTargetKm}</Text>
            <Text className="text-lg text-gray-400">km/day</Text>
          </View>

          {/* Delta indicator */}
          {userAdjustedGoal && deltaText && (
            <View className="flex-row items-center gap-1 mt-3">
              <Icon
                name={delta > 0 ? 'arrow-up' : 'arrow-down'}
                size="sm"
                color={delta > 0 ? '#22c55e' : '#f59e0b'}
              />
              <Text
                className={`text-sm font-medium ${
                  delta > 0 ? 'text-green-500' : 'text-amber-500'
                }`}
              >
                {deltaText} from suggested
              </Text>
            </View>
          )}
        </View>

        {/* LLM Reasoning Card */}
        <View className="rounded-2xl bg-background-secondary/60 border border-border-subtle p-4 mb-6">
          <View className="flex-row items-start gap-3">
            <View className="w-8 h-8 rounded-full bg-primary-500/20 items-center justify-center">
              <Icon name="sparkles" size="sm" color="#00f5d4" />
            </View>
            <View className="flex-1">
              <Text className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                AI Recommendation
              </Text>
              <Text className="text-sm text-gray-300 leading-relaxed">
                {reasoning}
              </Text>
            </View>
          </View>
        </View>

        {/* Slider */}
        <View className="mb-6">
          <DistanceSlider
            value={dailyTargetKm}
            min={0.5}
            max={10}
            step={0.5}
            unit="km"
            onChange={handleSliderChange}
          />
        </View>

        {/* Reward Preview Card */}
        <View className="rounded-2xl bg-background-secondary border border-border-subtle p-5">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-xs text-gray-500 tracking-wider uppercase mb-1">
                Daily Reward
              </Text>
              <Text className="text-2xl font-bold text-white">
                {rewardMinutes} min
              </Text>
              <Text className="text-sm text-gray-400">of screen time</Text>
            </View>
            <View className="w-16 h-16 rounded-full bg-primary-500/20 items-center justify-center">
              <Icon name="phone" size="xl" color="#00f5d4" />
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Footer */}
      <View
        className="absolute bottom-0 left-0 right-0 px-6 pt-4"
        style={{ paddingBottom: Math.max(insets.bottom, 16) + 8 }}
      >
        <View className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background-primary via-background-primary/95 to-transparent pointer-events-none" />
        <View className="relative">
          <Button onPress={handleContinue}>Continue</Button>
        </View>
      </View>
    </View>
  );
}
