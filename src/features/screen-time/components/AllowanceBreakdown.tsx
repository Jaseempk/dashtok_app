import { View, Text } from 'react-native';
import { Icon } from '@/components/ui';
import type { EnforcementStatus } from '../types/screenTime.types';

interface AllowanceBreakdownProps {
  status: EnforcementStatus | undefined;
  earnedMinutes?: number;
  bonusMinutes?: number;
}

/**
 * Breakdown of screen time allowance: Earned | Bonus | Used
 */
export function AllowanceBreakdown({
  status,
  earnedMinutes = 0,
  bonusMinutes = 0,
}: AllowanceBreakdownProps) {
  const usedMinutes = status?.usedMinutes ?? 0;

  const formatMinutes = (minutes: number): string => {
    if (minutes >= 60) {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
    }
    return `${minutes}m`;
  };

  return (
    <View className="flex-row justify-between gap-2">
      {/* Earned */}
      <View className="flex-1 p-3 rounded-xl bg-background-secondary items-center">
        <Text className="text-xs text-gray-400 mb-1">Earned</Text>
        <View className="flex-row items-center">
          <Icon name="trending-up" size="sm" color="#00f5d4" />
          <Text className="text-lg font-bold text-primary-500 ml-1">
            {formatMinutes(earnedMinutes)}
          </Text>
        </View>
      </View>

      {/* Bonus */}
      <View className="flex-1 p-3 rounded-xl bg-background-secondary items-center">
        <Text className="text-xs text-gray-400 mb-1">Bonus</Text>
        <View className="flex-row items-center">
          <Icon name="star" size="sm" color="#f97316" />
          <Text className="text-lg font-bold text-secondary-500 ml-1">
            {formatMinutes(bonusMinutes)}
          </Text>
        </View>
      </View>

      {/* Used */}
      <View className="flex-1 p-3 rounded-xl bg-background-secondary items-center">
        <Text className="text-xs text-gray-400 mb-1">Used</Text>
        <View className="flex-row items-center">
          <Icon name="time" size="sm" color="#9ca3af" />
          <Text className="text-lg font-bold text-gray-400 ml-1">
            {formatMinutes(usedMinutes)}
          </Text>
        </View>
      </View>
    </View>
  );
}
