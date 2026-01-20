import { View, Text } from 'react-native';
import { colors } from '@/styles/tokens';
import type { Allowance } from '../types/allowance.types';

interface WeeklyChartProps {
  history: Allowance[];
  maxMinutes?: number;
}

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const;

function getDayOfWeek(dateStr: string): number {
  const date = new Date(dateStr);
  // getDay returns 0 for Sunday, we want 0 for Monday
  const day = date.getDay();
  return day === 0 ? 6 : day - 1;
}

export function WeeklyChart({ history, maxMinutes = 120 }: WeeklyChartProps) {
  // Map history to days of the week
  const weekData = DAYS.map((_, index) => {
    const dayAllowance = history.find((a) => getDayOfWeek(a.date) === index);
    return {
      earned: dayAllowance?.earnedMinutes ?? 0,
      bonus: dayAllowance?.bonusMinutes ?? 0,
      used: dayAllowance?.usedMinutes ?? 0,
    };
  });

  // Calculate dynamic max if needed
  const actualMax = Math.max(
    maxMinutes,
    ...weekData.map((d) => d.earned + d.bonus)
  );

  return (
    <View className="bg-background-secondary rounded-xl p-4">
      <Text className="text-sm font-medium text-gray-400 mb-4">This Week</Text>
      <View className="flex-row justify-between items-end h-32">
        {DAYS.map((day, index) => {
          const data = weekData[index]!;
          const total = data.earned + data.bonus;
          const heightPercent = actualMax > 0 ? (total / actualMax) * 100 : 0;
          const earnedPercent = total > 0 ? (data.earned / total) * 100 : 100;
          const todayStr = new Date().toISOString().split('T')[0] ?? '';
          const isToday = index === getDayOfWeek(todayStr);

          return (
            <View key={day} className="items-center flex-1">
              <View className="flex-1 w-full px-1 justify-end">
                {total > 0 ? (
                  <View
                    className="w-full rounded-t overflow-hidden"
                    style={{ height: `${Math.max(heightPercent, 5)}%` }}
                  >
                    {/* Earned portion */}
                    <View
                      className="w-full"
                      style={{
                        height: `${earnedPercent}%`,
                        backgroundColor: colors.primary[500],
                      }}
                    />
                    {/* Bonus portion */}
                    {data.bonus > 0 && (
                      <View
                        className="w-full"
                        style={{
                          height: `${100 - earnedPercent}%`,
                          backgroundColor: colors.secondary[500],
                        }}
                      />
                    )}
                  </View>
                ) : (
                  <View
                    className="w-full rounded-t bg-background-tertiary"
                    style={{ height: '5%' }}
                  />
                )}
              </View>
              <Text
                className={`text-xs mt-2 ${
                  isToday ? 'text-primary-500 font-semibold' : 'text-gray-500'
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
