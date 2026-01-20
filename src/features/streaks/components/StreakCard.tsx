import { View, Text } from 'react-native';
import { Icon } from '@/components/ui';
import { colors } from '@/styles/tokens';
import { getStreakTier } from '../types/streak.types';
import type { Streak } from '../types/streak.types';

interface StreakCardProps {
  streak: Streak;
  compact?: boolean;
}

export function StreakCard({ streak, compact = false }: StreakCardProps) {
  const tier = getStreakTier(streak.currentStreak);
  const multiplierDisplay = streak.multiplier > 1 ? `${streak.multiplier}x` : '';

  if (compact) {
    return (
      <View className="flex-row items-center gap-2 bg-secondary-500/20 px-3 py-2 rounded-full">
        <Icon name="flame" size="sm" color={colors.secondary[500]} />
        <Text className="text-sm font-semibold text-secondary-500">
          {streak.currentStreak} day{streak.currentStreak !== 1 ? 's' : ''}
        </Text>
        {multiplierDisplay && (
          <View className="bg-secondary-500 px-2 py-0.5 rounded">
            <Text className="text-xs font-bold text-black">{multiplierDisplay}</Text>
          </View>
        )}
      </View>
    );
  }

  return (
    <View className="bg-background-secondary rounded-2xl p-6 items-center">
      {/* Flame Icon */}
      <View
        className="w-24 h-24 rounded-full items-center justify-center mb-4"
        style={{ backgroundColor: `${colors.secondary[500]}20` }}
      >
        <Icon name="flame" size={48} color={colors.secondary[500]} />
      </View>

      {/* Streak Number */}
      <Text className="text-5xl font-bold text-white">{streak.currentStreak}</Text>
      <Text className="text-lg text-gray-400 mt-1">Day Streak</Text>

      {/* Multiplier Badge */}
      {streak.multiplier > 1 && (
        <View className="bg-secondary-500 px-4 py-2 rounded-full mt-4">
          <Text className="text-lg font-bold text-black">{multiplierDisplay} Bonus</Text>
        </View>
      )}

      {/* Stats Row */}
      <View className="flex-row mt-6 gap-8">
        <View className="items-center">
          <Text className="text-2xl font-bold text-white">{streak.currentStreak}</Text>
          <Text className="text-xs text-gray-400 uppercase">Current</Text>
        </View>
        <View className="items-center">
          <Text className="text-2xl font-bold text-white">{streak.longestStreak}</Text>
          <Text className="text-xs text-gray-400 uppercase">Longest</Text>
        </View>
      </View>

      {/* Tier Badge */}
      <View
        className="mt-4 px-4 py-2 rounded-full"
        style={{ backgroundColor: `${tier.color}20` }}
      >
        <Text style={{ color: tier.color }} className="text-sm font-semibold">
          {tier.name} Streak
        </Text>
      </View>
    </View>
  );
}
