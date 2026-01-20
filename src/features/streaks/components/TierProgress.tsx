import { View, Text } from 'react-native';
import { Icon } from '@/components/ui';
import { getStreakTier, getNextTier, STREAK_TIERS } from '../types/streak.types';

interface TierProgressProps {
  currentDays: number;
}

export function TierProgress({ currentDays }: TierProgressProps) {
  const currentTier = getStreakTier(currentDays);
  const nextTier = getNextTier(currentDays);

  // Calculate progress to next tier
  let progress = 1;
  let daysToNext = 0;

  if (nextTier) {
    const daysInCurrentTier = currentDays - currentTier.minDays + 1;
    const tierRange = nextTier.minDays - currentTier.minDays;
    progress = daysInCurrentTier / tierRange;
    daysToNext = nextTier.minDays - currentDays;
  }

  return (
    <View className="bg-background-secondary rounded-xl p-4">
      <View className="flex-row items-center justify-between mb-3">
        <Text className="text-sm font-medium text-gray-400">Tier Progress</Text>
        <View
          className="px-3 py-1 rounded-full"
          style={{ backgroundColor: `${currentTier.color}20` }}
        >
          <Text style={{ color: currentTier.color }} className="text-xs font-semibold">
            {currentTier.name}
          </Text>
        </View>
      </View>

      {/* Progress Bar */}
      <View className="h-3 bg-background-tertiary rounded-full overflow-hidden mb-3">
        <View
          className="h-full rounded-full"
          style={{
            width: `${Math.min(progress * 100, 100)}%`,
            backgroundColor: currentTier.color,
          }}
        />
      </View>

      {/* Tier Labels */}
      <View className="flex-row justify-between">
        {STREAK_TIERS.map((tier, index) => {
          const isActive = currentDays >= tier.minDays;
          const isCurrent = tier.name === currentTier.name;

          return (
            <View key={tier.name} className="items-center">
              <View
                className={`w-8 h-8 rounded-full items-center justify-center mb-1 ${
                  isCurrent ? 'border-2' : ''
                }`}
                style={{
                  backgroundColor: isActive ? `${tier.color}30` : '#1f2937',
                  borderColor: isCurrent ? tier.color : 'transparent',
                }}
              >
                {isActive ? (
                  <Icon name="check" size="sm" color={tier.color} />
                ) : (
                  <Text className="text-xs text-gray-500">{tier.minDays}</Text>
                )}
              </View>
              <Text
                className="text-xs"
                style={{ color: isActive ? tier.color : '#6b7280' }}
              >
                {tier.name}
              </Text>
              <Text className="text-xs text-gray-500">{tier.multiplier}x</Text>
            </View>
          );
        })}
      </View>

      {/* Next Tier Info */}
      {nextTier && daysToNext > 0 && (
        <View className="mt-4 pt-4 border-t border-border-subtle">
          <Text className="text-sm text-gray-400 text-center">
            <Text className="text-white font-semibold">{daysToNext} more day{daysToNext !== 1 ? 's' : ''}</Text>
            {' '}to reach {nextTier.name} ({nextTier.multiplier}x bonus)
          </Text>
        </View>
      )}

      {!nextTier && (
        <View className="mt-4 pt-4 border-t border-border-subtle">
          <Text className="text-sm text-center" style={{ color: currentTier.color }}>
            You've reached the highest tier!
          </Text>
        </View>
      )}
    </View>
  );
}
