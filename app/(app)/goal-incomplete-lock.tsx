import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon, Button, ProgressRing } from '@/components/ui';
import { useEnforcementStatus } from '@/features/screen-time';
import { colors } from '@/styles/tokens';

export default function GoalIncompleteLockScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { data: status } = useEnforcementStatus();

  const current = status?.nextUnlockRequirement?.current ?? 0;
  const target = status?.nextUnlockRequirement?.target ?? 2;
  const unit = status?.nextUnlockRequirement?.unit ?? 'km';
  const percentComplete = status?.nextUnlockRequirement?.percentComplete ?? 0;
  const progress = percentComplete / 100;

  // Calculate estimated walk time and reward
  const remaining = Math.max(0, target - current);
  const estimatedMinutes = Math.ceil(remaining * 12); // ~12 min per km walking
  const rewardMinutes = 15; // Base reward per milestone

  const handleGoForWalk = () => {
    router.back();
  };

  const handleBackToDashboard = () => {
    router.replace('/(app)/(tabs)');
  };

  return (
    <View
      className="flex-1 bg-background-primary"
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
    >
      {/* Streak Protector Badge */}
      <View className="items-center pt-8 pb-4">
        <View className="flex-row items-center gap-2 px-4 py-2 rounded-full bg-secondary-500/20">
          <Icon name="flame" size="sm" color={colors.secondary[500]} />
          <Text className="text-sm font-semibold text-secondary-500">
            STREAK PROTECTOR
          </Text>
        </View>
      </View>

      {/* Main Content */}
      <View className="flex-1 items-center justify-center px-6">
        {/* Progress Ring with Lock */}
        <View className="mb-6">
          <ProgressRing
            progress={progress}
            size={160}
            strokeWidth={10}
            color={colors.primary[500]}
            backgroundColor={colors.background.tertiary}
          >
            <View className="items-center">
              <Icon name="lock-closed" size={40} color={colors.primary[500]} />
            </View>
          </ProgressRing>
        </View>

        {/* Progress Text */}
        <View className="items-center mb-2">
          <Text className="text-3xl font-bold text-white">
            <Text className="text-primary-500">{current.toFixed(1)}</Text>
            <Text className="text-gray-400"> / {target} {unit}</Text>
          </Text>
          <Text className="text-sm font-semibold text-gray-500 uppercase tracking-wider mt-1">
            Locked
          </Text>
        </View>

        {/* Headline */}
        <View className="items-center mt-8 mb-4">
          <Text className="text-3xl font-bold text-white text-center">
            Movement =
          </Text>
          <Text className="text-3xl font-bold text-primary-500 text-center">
            Minutes
          </Text>
        </View>

        {/* Description */}
        <Text className="text-base text-gray-400 text-center mb-8 px-4">
          Your app access is currently paused until you hit your next milestone.
        </Text>

        {/* Info Card */}
        <View className="w-full bg-background-secondary rounded-2xl p-4 mb-8">
          <View className="flex-row items-start gap-3">
            <View className="w-10 h-10 rounded-full bg-primary-500/10 items-center justify-center">
              <Icon name="walk" size="md" color={colors.primary[500]} />
            </View>
            <View className="flex-1">
              <Text className="text-sm text-gray-300 leading-5">
                Just a{' '}
                <Text className="font-bold text-white">
                  {estimatedMinutes}-minute walk
                </Text>{' '}
                stands between you and your next{' '}
                <Text className="font-bold text-primary-500">
                  {rewardMinutes} minutes
                </Text>{' '}
                of scrolling.
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Footer Actions */}
      <View className="px-6 pb-4">
        <Button onPress={handleGoForWalk}>
          Go for a walk →
        </Button>
        <Pressable onPress={handleBackToDashboard} className="mt-4 py-3">
          <Text className="text-gray-400 text-center text-sm">
            Back to Dashboard
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
