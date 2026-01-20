import { View, Text } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon, Button, ProgressRing } from '@/components/ui';
import { colors } from '@/styles/tokens';

export default function LockWarningScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ neededKm?: string; rewardMinutes?: string }>();

  const neededKm = parseFloat(params.neededKm ?? '0.8');
  const rewardMinutes = parseInt(params.rewardMinutes ?? '15', 10);

  const handleGoForWalk = () => {
    // Navigate to activities or close and let user start an activity
    router.back();
  };

  const handleDismiss = () => {
    router.back();
  };

  return (
    <View
      className="flex-1 bg-background-primary items-center justify-center px-6"
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
    >
      {/* Warning Icon */}
      <View className="mb-8">
        <View
          className="w-32 h-32 rounded-full items-center justify-center"
          style={{ backgroundColor: `${colors.warning}20` }}
        >
          <Icon name="time" size={64} color={colors.warning} />
        </View>
      </View>

      {/* Main Message */}
      <Text className="text-3xl font-bold text-white text-center mb-2">
        Time's up!
      </Text>
      <Text className="text-base text-gray-400 text-center mb-8">
        You've used all your earned screen time for today.
      </Text>

      {/* Unlock Info Card */}
      <View className="bg-background-secondary rounded-2xl p-6 w-full mb-8">
        <View className="flex-row items-center justify-between mb-4">
          <View>
            <Text className="text-sm text-gray-400 mb-1">Walk</Text>
            <Text className="text-2xl font-bold text-white">{neededKm} km</Text>
          </View>
          <View>
            <ProgressRing
              progress={0}
              size={60}
              strokeWidth={6}
              color={colors.primary[500]}
            >
              <Icon name="walk" size="md" color={colors.primary[500]} />
            </ProgressRing>
          </View>
        </View>
        <View className="flex-row items-center gap-2 pt-4 border-t border-border-subtle">
          <Icon name="add" size="sm" color={colors.primary[500]} />
          <Text className="text-sm text-gray-400">
            to unlock{' '}
            <Text className="text-primary-500 font-semibold">{rewardMinutes} more minutes</Text>
          </Text>
        </View>
      </View>

      {/* Motivational Text */}
      <View className="bg-background-secondary/50 rounded-xl p-4 w-full mb-8">
        <View className="flex-row items-start gap-3">
          <Icon name="bulb" size="md" color="#f59e0b" />
          <View className="flex-1">
            <Text className="text-sm font-medium text-white mb-1">Movement = Minutes</Text>
            <Text className="text-xs text-gray-400 leading-5">
              Every step you take earns you more screen time. It's a simple equation:{' '}
              <Text className="text-primary-500">move more, watch more</Text>.
            </Text>
          </View>
        </View>
      </View>

      {/* Action Buttons */}
      <View className="w-full gap-3">
        <Button onPress={handleGoForWalk} icon="walk">
          Go for a walk
        </Button>
        <Button onPress={handleDismiss} variant="ghost">
          Maybe later
        </Button>
      </View>
    </View>
  );
}
