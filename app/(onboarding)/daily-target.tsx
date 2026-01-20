import { View, Text, Pressable, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '@/components/ui';
import { DistanceSlider } from '@/features/onboarding/components';
import { useOnboardingStore } from '@/features/onboarding/store/onboardingStore';

export default function DailyTargetScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { activityType, dailyTargetKm, weekendAdjust, setDailyTargetKm, setWeekendAdjust } =
    useOnboardingStore();

  const handleContinue = () => {
    router.push('/(onboarding)/health-permissions');
  };

  const handleBack = () => {
    router.back();
  };

  // Calculate screen time reward based on activity and distance
  const getScreenTimeReward = () => {
    const baseMinutes = activityType === 'run' ? 45 : activityType === 'walk' ? 20 : 30;
    const multiplier = dailyTargetKm / 2; // 2km = 1x, 4km = 2x, etc.
    return Math.round(baseMinutes * multiplier);
  };

  return (
    <View
      className="flex-1 bg-background-primary"
      style={{ paddingTop: insets.top }}
    >
      {/* Header */}
      <View className="flex-row items-center justify-between px-6 py-4">
        <Pressable
          onPress={handleBack}
          className="w-10 h-10 items-center justify-center rounded-full active:bg-background-secondary"
        >
          <Text className="text-gray-400 text-2xl">←</Text>
        </Pressable>
        <Text className="text-xs font-semibold text-gray-400 tracking-wider uppercase">
          Step 5 of 6
        </Text>
        <View className="w-10" />
      </View>

      <View className="flex-1 px-6">
        {/* Title */}
        <Text className="text-3xl font-bold text-white mb-2">
          Set your daily{'\n'}target
        </Text>
        <Text className="text-base text-gray-400 mb-8">
          Start with something achievable. You can{'\n'}adjust this anytime.
        </Text>

        {/* Current Value Display */}
        <View className="items-center mb-8">
          <View className="w-40 h-40 rounded-full bg-background-secondary border-4 border-primary-500 items-center justify-center">
            <Text className="text-5xl font-bold text-white">{dailyTargetKm}</Text>
            <Text className="text-lg text-gray-400">km/day</Text>
          </View>
        </View>

        {/* Slider */}
        <View className="mb-8">
          <DistanceSlider
            value={dailyTargetKm}
            min={0.5}
            max={10}
            step={0.5}
            unit="km"
            onChange={setDailyTargetKm}
          />
        </View>

        {/* Reward Preview Card */}
        <View className="rounded-2xl bg-background-secondary border border-border-subtle p-5 mb-6">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-xs text-gray-500 tracking-wider uppercase mb-1">
                Daily Reward
              </Text>
              <Text className="text-2xl font-bold text-white">
                {getScreenTimeReward()} min
              </Text>
              <Text className="text-sm text-gray-400">of screen time</Text>
            </View>
            <View className="w-16 h-16 rounded-full bg-primary-500/20 items-center justify-center">
              <Text className="text-3xl">📱</Text>
            </View>
          </View>
        </View>

        {/* Weekend Adjust Toggle */}
        <View className="flex-row items-center justify-between rounded-2xl bg-background-secondary border border-border-subtle p-5">
          <View className="flex-1 mr-4">
            <Text className="text-lg font-semibold text-white mb-1">
              Weekend flex mode
            </Text>
            <Text className="text-sm text-gray-400">
              Reduce targets by 25% on weekends
            </Text>
          </View>
          <Switch
            value={weekendAdjust}
            onValueChange={setWeekendAdjust}
            trackColor={{ false: '#374151', true: '#00f5d4' }}
            thumbColor="#ffffff"
          />
        </View>
      </View>

      {/* Footer */}
      <View
        className="px-6 pt-4 bg-background-primary"
        style={{ paddingBottom: Math.max(insets.bottom, 16) + 8 }}
      >
        <Button onPress={handleContinue}>Continue</Button>
      </View>
    </View>
  );
}
