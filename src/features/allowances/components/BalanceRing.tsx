import { View, Text } from 'react-native';
import { MultiProgressRing } from '@/components/ui';
import { colors } from '@/styles/tokens';

interface BalanceRingProps {
  earnedMinutes: number;
  bonusMinutes: number;
  usedMinutes: number;
  size?: number;
}

function formatTime(minutes: number): { hours: number; mins: number } {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return { hours, mins };
}

export function BalanceRing({
  earnedMinutes,
  bonusMinutes,
  usedMinutes,
  size = 180,
}: BalanceRingProps) {
  const totalMinutes = earnedMinutes + bonusMinutes;
  const remainingMinutes = Math.max(0, totalMinutes - usedMinutes);
  const { hours, mins } = formatTime(remainingMinutes);

  // Calculate progress segments
  const earnedProgress = totalMinutes > 0 ? earnedMinutes / totalMinutes : 0;
  const bonusProgress = totalMinutes > 0 ? bonusMinutes / totalMinutes : 0;
  const usedProgress = totalMinutes > 0 ? usedMinutes / totalMinutes : 0;

  // Segments for the ring (what's been used is shown in a muted color)
  const segments: Array<{ progress: number; color: string }> = [
    { progress: Math.max(0, earnedProgress - usedProgress), color: colors.primary[500] },
    { progress: bonusProgress, color: colors.secondary[500] },
  ].filter(s => s.progress > 0);

  // If all used, show empty ring
  if (segments.length === 0 || remainingMinutes === 0) {
    segments.push({ progress: 0.001, color: colors.background.tertiary });
  }

  return (
    <MultiProgressRing
      segments={segments}
      size={size}
      strokeWidth={12}
      backgroundColor={colors.background.tertiary}
    >
      <View className="items-center">
        <Text className="text-4xl font-bold text-white">
          {hours}h {mins}m
        </Text>
        <Text className="text-sm text-gray-400 mt-1">remaining</Text>
      </View>
    </MultiProgressRing>
  );
}

interface BalanceBreakdownProps {
  earnedMinutes: number;
  bonusMinutes: number;
  usedMinutes: number;
}

export function BalanceBreakdown({
  earnedMinutes,
  bonusMinutes,
  usedMinutes,
}: BalanceBreakdownProps) {
  return (
    <View className="flex-row justify-around py-4">
      <View className="items-center">
        <View className="flex-row items-center gap-1">
          <View className="w-2 h-2 rounded-full bg-primary-500" />
          <Text className="text-xs text-gray-400 uppercase">Earned</Text>
        </View>
        <Text className="text-lg font-semibold text-white mt-1">{earnedMinutes}m</Text>
      </View>
      <View className="items-center">
        <View className="flex-row items-center gap-1">
          <View className="w-2 h-2 rounded-full" style={{ backgroundColor: colors.secondary[500] }} />
          <Text className="text-xs text-gray-400 uppercase">Bonus</Text>
        </View>
        <Text className="text-lg font-semibold text-white mt-1">{bonusMinutes}m</Text>
      </View>
      <View className="items-center">
        <View className="flex-row items-center gap-1">
          <View className="w-2 h-2 rounded-full bg-gray-500" />
          <Text className="text-xs text-gray-400 uppercase">Used</Text>
        </View>
        <Text className="text-lg font-semibold text-white mt-1">{usedMinutes}m</Text>
      </View>
    </View>
  );
}
