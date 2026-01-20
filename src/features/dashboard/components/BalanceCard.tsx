import { View, Text } from 'react-native';

interface BalanceCardProps {
  earnedMinutes: number;
  bonusMinutes: number;
  usedMinutes: number;
}

export function BalanceCard({ earnedMinutes, bonusMinutes, usedMinutes }: BalanceCardProps) {
  const totalMinutes = earnedMinutes + bonusMinutes;
  const remainingMinutes = Math.max(0, totalMinutes - usedMinutes);

  // Calculate bar proportions
  const total = earnedMinutes + bonusMinutes;
  const earnedPercent = total > 0 ? (earnedMinutes / total) * 100 : 0;
  const bonusPercent = total > 0 ? (bonusMinutes / total) * 100 : 0;

  return (
    <View className="p-4 rounded-2xl bg-background-secondary border border-border-subtle">
      {/* Header */}
      <View className="flex-row items-center justify-between mb-3">
        <Text className="text-base font-semibold text-white">Available Balance</Text>
        <View className="px-2 py-1 rounded-full bg-background-tertiary">
          <Text className="text-xs text-gray-400">Expires 12AM</Text>
        </View>
      </View>

      {/* Large balance display */}
      <View className="flex-row items-baseline mb-4">
        <Text className="text-4xl font-bold text-white">{remainingMinutes}</Text>
        <Text className="text-xl text-gray-400 ml-1">min</Text>
      </View>

      {/* Progress bar */}
      <View className="h-2 rounded-full bg-background-tertiary overflow-hidden flex-row">
        {earnedPercent > 0 && (
          <View
            className="h-full bg-primary-500 rounded-l-full"
            style={{ width: `${earnedPercent}%` }}
          />
        )}
        {bonusPercent > 0 && (
          <View
            className="h-full bg-secondary-500"
            style={{
              width: `${bonusPercent}%`,
              borderTopRightRadius: 9999,
              borderBottomRightRadius: 9999,
            }}
          />
        )}
      </View>

      {/* Labels */}
      <View className="flex-row justify-between mt-2">
        <Text className="text-sm text-primary-500">{earnedMinutes}m Earned</Text>
        {bonusMinutes > 0 && (
          <Text className="text-sm text-secondary-500">{bonusMinutes}m Bonus</Text>
        )}
      </View>
    </View>
  );
}
