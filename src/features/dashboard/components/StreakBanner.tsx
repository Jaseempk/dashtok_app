import { View, Text, Pressable } from 'react-native';
import { Icon } from '@/components/ui';

interface StreakBannerProps {
  currentStreak: number;
  multiplier: number;
  onPress?: () => void;
}

export function StreakBanner({ currentStreak, multiplier, onPress }: StreakBannerProps) {
  const hasStreak = currentStreak > 0;
  const hasBonus = multiplier > 1;

  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center justify-between p-4 rounded-2xl bg-background-secondary border border-secondary-500/30 active:opacity-80"
    >
      <View className="flex-row items-center gap-3">
        {/* Flame icon */}
        <View className="w-10 h-10 rounded-xl bg-secondary-500/20 items-center justify-center">
          <Icon name="flame" size="lg" color="#f97316" />
        </View>

        {/* Streak text */}
        <View>
          <Text className="text-lg font-bold text-white">
            {hasStreak ? `${currentStreak} Day Streak` : 'Start Your Streak'}
          </Text>
          <Text className="text-sm text-secondary-500">
            {hasStreak ? 'Keep it up!' : 'Complete today\'s goal'}
          </Text>
        </View>
      </View>

      {/* Multiplier badge */}
      {hasBonus && (
        <View className="px-3 py-1.5 rounded-full bg-secondary-500/20 border border-secondary-500">
          <Text className="text-sm font-semibold text-secondary-500">
            {multiplier.toFixed(2)}x Multiplier
          </Text>
        </View>
      )}
    </Pressable>
  );
}
