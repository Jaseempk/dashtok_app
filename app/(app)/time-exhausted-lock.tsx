import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon, Button } from '@/components/ui';
import { useEnforcementStatus, useEmergencyBypass } from '@/features/screen-time';
import { useStreak } from '@/features/streaks';
import { colors } from '@/styles/tokens';

export default function TimeExhaustedLockScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { data: status } = useEnforcementStatus();
  const { data: streak } = useStreak();
  const { mutate: requestBypass, isPending: isBypassPending } = useEmergencyBypass();

  const usedMinutes = status?.usedMinutes ?? 0;
  const current = status?.nextUnlockRequirement?.current ?? 0;
  const target = status?.nextUnlockRequirement?.target ?? 2;
  const unit = status?.nextUnlockRequirement?.unit ?? 'km';
  const percentComplete = status?.nextUnlockRequirement?.percentComplete ?? 0;
  const bypassesLeft = status?.emergencyBypassesLeft ?? 0;
  const bypassAvailable = status?.emergencyBypassAvailable ?? false;

  // Calculate distance needed for next 15 minutes
  const remaining = Math.max(0, target - current);
  const distanceForNextReward = Math.min(remaining, 0.8); // Partial goal for quick reward
  const minutesToEarn = 15;

  const streakDays = streak?.currentStreak ?? 0;

  const handleEarnMore = () => {
    router.back();
  };

  const handleClose = () => {
    router.replace('/(app)/(tabs)');
  };

  const handleEmergencyBypass = () => {
    if (!bypassAvailable || bypassesLeft <= 0) return;

    requestBypass(undefined, {
      onSuccess: (result) => {
        if (result.granted) {
          router.back();
        }
      },
    });
  };

  return (
    <View
      className="flex-1 bg-background-primary"
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
    >
      {/* Main Card */}
      <View className="flex-1 mx-4 mt-8 mb-4">
        <View className="flex-1 bg-background-secondary rounded-3xl p-6">
          {/* Flame Icon */}
          <View className="items-center pt-4 pb-6">
            <View className="w-16 h-16 rounded-full bg-secondary-500/20 items-center justify-center">
              <Icon name="flame" size={32} color={colors.secondary[500]} />
            </View>
          </View>

          {/* Time's Up Headline */}
          <View className="items-center mb-4">
            <Text className="text-3xl font-bold text-white">
              Time's up! 🛑
            </Text>
          </View>

          {/* Used Time Info */}
          <Text className="text-base text-gray-400 text-center mb-6">
            You've used your {usedMinutes} minutes of earned screen time.
          </Text>

          {/* Unlock More Info */}
          <View className="items-center mb-6">
            <Text className="text-xl font-semibold text-white">
              Walk{' '}
              <Text className="text-primary-500">
                {distanceForNextReward.toFixed(1)} {unit}
              </Text>{' '}
              to unlock
            </Text>
            <Text className="text-xl font-bold text-white">
              {minutesToEarn} more minutes
            </Text>
          </View>

          {/* Today's Activity Progress */}
          <View className="bg-background-tertiary rounded-xl p-4 mb-6">
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-sm font-medium text-gray-300">
                Today's Activity
              </Text>
              <Text className="text-sm font-semibold">
                <Text className="text-primary-500">{current.toFixed(1)}</Text>
                <Text className="text-gray-400"> / {target} {unit}</Text>
              </Text>
            </View>

            {/* Progress Bar */}
            <View className="h-2 bg-background-primary rounded-full overflow-hidden mb-3">
              <View
                className="h-full bg-primary-500 rounded-full"
                style={{ width: `${Math.min(percentComplete, 100)}%` }}
              />
            </View>

            {/* Streak Motivation */}
            {streakDays > 0 && (
              <Text className="text-xs text-gray-500 text-center">
                Keep walking to maintain your {streakDays}-day streak!
              </Text>
            )}
          </View>

          {/* Action Buttons */}
          <View className="gap-3">
            <Button onPress={handleEarnMore} icon="walk">
              Earn more time now
            </Button>

            <Button onPress={handleClose} variant="outline">
              Close App
            </Button>
          </View>

          {/* Emergency Bypass Link */}
          <View className="items-center mt-6">
            {bypassAvailable && bypassesLeft > 0 ? (
              <Pressable
                onPress={handleEmergencyBypass}
                disabled={isBypassPending}
                className="py-2"
              >
                <Text className="text-sm text-gray-500 underline">
                  {isBypassPending
                    ? 'Activating bypass...'
                    : `Emergency 5-min bypass (${bypassesLeft} use${bypassesLeft !== 1 ? 's' : ''} left today)`}
                </Text>
              </Pressable>
            ) : (
              <Text className="text-sm text-gray-600">
                No emergency bypasses left today
              </Text>
            )}
          </View>
        </View>
      </View>

      {/* Footer Branding */}
      <View className="items-center pb-4">
        <Text className="text-xs font-semibold text-gray-600 tracking-widest">
          DASHTOK WELLNESS
        </Text>
      </View>
    </View>
  );
}
