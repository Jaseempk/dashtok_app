import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

import { Icon } from '@/components/ui';
import { colors } from '@/styles/tokens';

interface TimeWarningBannerProps {
  remainingMinutes: number;
  remainingFormatted: string;
  onDismiss?: () => void;
}

/**
 * Warning banner shown when screen time is running low (< 5 minutes).
 * Animated entrance/exit for smooth UX.
 */
export function TimeWarningBanner({
  remainingMinutes,
  remainingFormatted,
  onDismiss,
}: TimeWarningBannerProps) {
  const router = useRouter();

  const handleEarnMore = () => {
    router.push('/(app)/(tabs)');
    onDismiss?.();
  };

  return (
    <Animated.View
      entering={FadeIn.duration(300)}
      exiting={FadeOut.duration(200)}
      className="mx-4 mb-4"
    >
      <View className="bg-secondary-500/20 border border-secondary-500/30 rounded-xl p-4">
        <View className="flex-row items-center gap-3">
          {/* Warning Icon */}
          <View className="w-10 h-10 rounded-full bg-secondary-500/20 items-center justify-center">
            <Icon name="warning" size="md" color={colors.secondary[500]} />
          </View>

          {/* Content */}
          <View className="flex-1">
            <Text className="text-base font-semibold text-secondary-500">
              Time Running Low
            </Text>
            <Text className="text-sm text-gray-400">
              Only <Text className="font-bold text-white">{remainingFormatted}</Text> remaining
            </Text>
          </View>

          {/* Action */}
          <Pressable
            onPress={handleEarnMore}
            className="px-3 py-2 bg-secondary-500/20 rounded-lg"
          >
            <Text className="text-sm font-medium text-secondary-500">
              Earn More
            </Text>
          </Pressable>
        </View>
      </View>
    </Animated.View>
  );
}
