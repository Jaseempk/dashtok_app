import { View, Text, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useMemo } from 'react';

import { Icon, Button } from '@/components/ui';
import {
  useStreak,
  StreakCard,
  TierProgress,
  StreakCalendar,
} from '@/features/streaks';
import { useAllowanceHistory } from '@/features/allowances';

export default function StreakModal() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const { data: streak, isLoading: isLoadingStreak } = useStreak();
  const { data: history } = useAllowanceHistory({ limit: 56 }); // 8 weeks

  // Get completed dates for calendar
  const completedDates = useMemo(() => {
    if (!history) return [];
    return history
      .filter((a) => a.isUnlocked)
      .map((a) => a.date);
  }, [history]);

  const handleClose = () => {
    router.back();
  };

  if (isLoadingStreak) {
    return (
      <View className="flex-1 bg-background-primary items-center justify-center">
        <ActivityIndicator size="large" color="#00f5d4" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background-primary" style={{ paddingTop: insets.top }}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-4 border-b border-border-subtle">
        <Pressable onPress={handleClose} className="w-10 h-10 items-center justify-center">
          <Icon name="close" size="lg" color="#9ca3af" />
        </Pressable>
        <Text className="text-lg font-semibold text-white">Your Streak</Text>
        <View className="w-10" />
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 32 }}
        showsVerticalScrollIndicator={false}
      >
        {streak && (
          <>
            {/* Streak Card */}
            <View className="mb-6">
              <StreakCard streak={streak} />
            </View>

            {/* Tier Progress */}
            <View className="mb-6">
              <TierProgress currentDays={streak.currentStreak} />
            </View>

            {/* Calendar */}
            <View className="mb-6">
              <StreakCalendar completedDates={completedDates} weeks={8} />
            </View>

            {/* Motivational Section */}
            <View className="bg-background-secondary rounded-xl p-4 mb-6">
              <View className="flex-row items-center gap-3 mb-3">
                <Icon name="bulb" size="md" color="#f59e0b" />
                <Text className="text-base font-semibold text-white">Streak Tips</Text>
              </View>
              <Text className="text-sm text-gray-400 leading-5">
                {streak.currentStreak === 0
                  ? "Start your streak by completing today's goal. Every journey begins with a single step!"
                  : streak.currentStreak < 7
                  ? `You're ${7 - streak.currentStreak} days away from your first bonus multiplier. Keep going!`
                  : streak.currentStreak < 14
                  ? "Great progress! Maintain your streak to unlock higher multipliers."
                  : streak.currentStreak < 30
                  ? "You're building an incredible habit. The Gold tier awaits at 30 days!"
                  : "You've achieved Gold status! You're earning maximum bonus minutes."}
              </Text>
            </View>
          </>
        )}

        {/* Empty State */}
        {!isLoadingStreak && !streak && (
          <View className="items-center py-12">
            <Icon name="flame" size={48} color="#6b7280" />
            <Text className="text-lg text-gray-400 mt-4">No streak data yet</Text>
            <Text className="text-sm text-gray-500 mt-2 text-center">
              Complete your first daily goal to start your streak!
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Footer CTA */}
      <View
        className="px-4 pt-4 bg-background-primary border-t border-border-subtle"
        style={{ paddingBottom: Math.max(insets.bottom, 16) }}
      >
        <Button onPress={handleClose} icon="flame">
          Continue Journey
        </Button>
      </View>
    </View>
  );
}
