import { View, Text } from 'react-native';
import { colors } from '@/styles/tokens';
import type { Allowance } from '../types/allowance.types';

interface WeeklyChartProps {
  history: Allowance[];
  maxMinutes?: number;
}

const DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'] as const;
const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const;

function getDayOfWeek(dateStr: string): number {
  const date = new Date(dateStr);
  // getDay returns 0 for Sunday, we want 0 for Monday
  const day = date.getDay();
  return day === 0 ? 6 : day - 1;
}

/**
 * Weekly bar chart showing earned (cyan) vs used (gray) screen time.
 * Matches the design from screen_time_allowance_tracking.
 */
export function WeeklyChart({ history, maxMinutes = 120 }: WeeklyChartProps) {
  // Map history to days of the week
  const weekData = DAYS.map((_, index) => {
    const dayAllowance = history.find((a) => getDayOfWeek(a.date) === index);
    return {
      earned: (dayAllowance?.earnedMinutes ?? 0) + (dayAllowance?.bonusMinutes ?? 0),
      used: dayAllowance?.usedMinutes ?? 0,
    };
  });

  // Calculate dynamic max based on highest earned or used value
  const actualMax = Math.max(
    maxMinutes,
    ...weekData.map((d) => Math.max(d.earned, d.used))
  );

  const todayIndex = getDayOfWeek(new Date().toISOString().split('T')[0] ?? '');

  return (
    <View className="bg-background-secondary rounded-xl p-4">
      {/* Legend */}
      <View className="flex-row items-center justify-end gap-4 mb-4">
        <View className="flex-row items-center gap-1.5">
          <View className="w-2 h-2 rounded-full bg-primary-500" />
          <Text className="text-xs text-gray-400">Earned</Text>
        </View>
        <View className="flex-row items-center gap-1.5">
          <View className="w-2 h-2 rounded-full bg-gray-500" />
          <Text className="text-xs text-gray-400">Used</Text>
        </View>
      </View>

      {/* Chart */}
      <View className="flex-row justify-between items-end h-28">
        {DAYS.map((day, index) => {
          const data = weekData[index]!;
          const earnedHeight = actualMax > 0 ? (data.earned / actualMax) * 100 : 0;
          const usedHeight = actualMax > 0 ? (data.used / actualMax) * 100 : 0;
          const isToday = index === todayIndex;
          const isFuture = index > todayIndex;

          return (
            <View key={`${day}-${index}`} className="items-center flex-1">
              {/* Bars container */}
              <View className="flex-1 w-full px-0.5 justify-end">
                <View className="flex-row gap-0.5 items-end h-full">
                  {/* Earned bar (cyan) */}
                  <View className="flex-1 justify-end h-full">
                    <View
                      className="w-full rounded-t"
                      style={{
                        height: `${Math.max(earnedHeight, isFuture ? 0 : 3)}%`,
                        backgroundColor: isFuture
                          ? colors.gray[700]
                          : colors.primary[500],
                        opacity: isFuture ? 0.3 : 1,
                      }}
                    />
                  </View>
                  {/* Used bar (gray) */}
                  <View className="flex-1 justify-end h-full">
                    <View
                      className="w-full rounded-t"
                      style={{
                        height: `${Math.max(usedHeight, isFuture ? 0 : 3)}%`,
                        backgroundColor: isFuture
                          ? colors.gray[700]
                          : colors.gray[500],
                        opacity: isFuture ? 0.3 : 1,
                      }}
                    />
                  </View>
                </View>
              </View>
              {/* Day label */}
              <Text
                className={`text-xs mt-2 ${
                  isToday
                    ? 'text-white font-bold'
                    : isFuture
                    ? 'text-gray-600'
                    : 'text-gray-500'
                }`}
              >
                {day}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}
