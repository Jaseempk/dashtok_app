import { View, Text } from 'react-native';
import { colors } from '@/styles/tokens';

interface StreakCalendarProps {
  completedDates: string[]; // Array of YYYY-MM-DD strings
  weeks?: number;
}

function getCalendarDays(weeks: number): Date[] {
  const days: Date[] = [];
  const today = new Date();
  const totalDays = weeks * 7;

  // Start from (totalDays - 1) days ago
  for (let i = totalDays - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    days.push(date);
  }

  return days;
}

function formatDateKey(date: Date): string {
  return date.toISOString().split('T')[0] ?? ''
}

export function StreakCalendar({ completedDates, weeks = 8 }: StreakCalendarProps) {
  const completedSet = new Set(completedDates);
  const days = getCalendarDays(weeks);

  // Group days into weeks
  const weekGroups: Date[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    weekGroups.push(days.slice(i, i + 7));
  }

  const today = formatDateKey(new Date());

  return (
    <View className="bg-background-secondary rounded-xl p-4">
      <Text className="text-sm font-medium text-gray-400 mb-4">Activity Calendar</Text>

      {/* Day labels */}
      <View className="flex-row mb-2">
        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
          <View key={i} className="flex-1 items-center">
            <Text className="text-xs text-gray-500">{day}</Text>
          </View>
        ))}
      </View>

      {/* Calendar grid */}
      <View className="gap-1">
        {weekGroups.map((week, weekIndex) => (
          <View key={weekIndex} className="flex-row gap-1">
            {week.map((date, dayIndex) => {
              const dateKey = formatDateKey(date);
              const isCompleted = completedSet.has(dateKey);
              const isToday = dateKey === today;
              const isFuture = date > new Date();

              return (
                <View
                  key={dayIndex}
                  className={`flex-1 aspect-square rounded-sm items-center justify-center ${
                    isToday ? 'border border-primary-500' : ''
                  }`}
                  style={{
                    backgroundColor: isFuture
                      ? 'transparent'
                      : isCompleted
                      ? colors.primary[500]
                      : colors.background.tertiary,
                    opacity: isFuture ? 0.3 : 1,
                  }}
                >
                  {isToday && !isCompleted && (
                    <View className="w-1 h-1 rounded-full bg-primary-500" />
                  )}
                </View>
              );
            })}
          </View>
        ))}
      </View>

      {/* Legend */}
      <View className="flex-row items-center justify-center gap-4 mt-4 pt-4 border-t border-border-subtle">
        <View className="flex-row items-center gap-2">
          <View className="w-3 h-3 rounded-sm bg-background-tertiary" />
          <Text className="text-xs text-gray-400">Missed</Text>
        </View>
        <View className="flex-row items-center gap-2">
          <View className="w-3 h-3 rounded-sm bg-primary-500" />
          <Text className="text-xs text-gray-400">Completed</Text>
        </View>
      </View>
    </View>
  );
}
