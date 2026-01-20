import { View, Text, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon } from '@/components/ui';
import {
  useTodayAllowance,
  useAllowanceHistory,
  useMarkUsed,
  BalanceRing,
  BalanceBreakdown,
  QuickAddButtons,
  WeeklyChart,
  AllowanceHistoryItem,
} from '@/features/allowances';

export default function ScreenTimeModal() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const { data: todayAllowance, isLoading: isLoadingToday } = useTodayAllowance();
  const { data: history, isLoading: isLoadingHistory } = useAllowanceHistory({ limit: 7 });
  const markUsed = useMarkUsed();

  const handleClose = () => {
    router.back();
  };

  const handleQuickAdd = (newUsedMinutes: number) => {
    markUsed.mutate(newUsedMinutes);
  };

  if (isLoadingToday) {
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
        <Text className="text-lg font-semibold text-white">Screen Time</Text>
        <View className="w-10" />
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 32 }}
        showsVerticalScrollIndicator={false}
      >
        {todayAllowance && (
          <>
            {/* Balance Ring */}
            <View className="items-center mb-6">
              <BalanceRing
                earnedMinutes={todayAllowance.earnedMinutes}
                bonusMinutes={todayAllowance.bonusMinutes}
                usedMinutes={todayAllowance.usedMinutes}
                size={200}
              />
            </View>

            {/* Breakdown Stats */}
            <View className="bg-background-secondary rounded-xl mb-6">
              <BalanceBreakdown
                earnedMinutes={todayAllowance.earnedMinutes}
                bonusMinutes={todayAllowance.bonusMinutes}
                usedMinutes={todayAllowance.usedMinutes}
              />
            </View>

            {/* Quick Add Buttons */}
            <View className="mb-6">
              <QuickAddButtons
                currentUsed={todayAllowance.usedMinutes}
                totalAvailable={todayAllowance.totalMinutes}
                onAddMinutes={handleQuickAdd}
                isLoading={markUsed.isPending}
              />
            </View>
          </>
        )}

        {/* Weekly Chart */}
        {!isLoadingHistory && history && history.length > 0 && (
          <View className="mb-6">
            <WeeklyChart history={history} />
          </View>
        )}

        {/* History List */}
        {!isLoadingHistory && history && history.length > 0 && (
          <View className="bg-background-secondary rounded-xl p-4">
            <Text className="text-sm font-medium text-gray-400 mb-2">Recent History</Text>
            {history.slice(0, 5).map((allowance) => (
              <AllowanceHistoryItem key={allowance.id} allowance={allowance} />
            ))}
          </View>
        )}

        {/* Empty State */}
        {!isLoadingToday && !todayAllowance && (
          <View className="items-center py-12">
            <Icon name="time" size={48} color="#6b7280" />
            <Text className="text-lg text-gray-400 mt-4">No allowance data yet</Text>
            <Text className="text-sm text-gray-500 mt-2 text-center">
              Complete your daily goals to earn screen time!
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
