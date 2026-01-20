import { View, ScrollView, RefreshControl, Text, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useState } from 'react';
import { useUser } from '@clerk/clerk-expo';

import { queryKeys } from '@/lib/query';
import {
  useTodayStats,
  useTodayAllowance,
  useStreak,
  useActiveGoals,
  ProgressRing,
  StreakBanner,
  BalanceCard,
  DashboardHeader,
  QuickActions,
  ActivityBreakdown,
  ScreenTimeEarned,
} from '@/features/dashboard';

export default function DashboardScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();
  const { user } = useUser();

  const [refreshing, setRefreshing] = useState(false);

  // Fetch all dashboard data
  const { data: todayStats, isLoading: statsLoading } = useTodayStats();
  const { data: allowance, isLoading: allowanceLoading } = useTodayAllowance();
  const { data: streak, isLoading: streakLoading } = useStreak();
  const { data: goals, isLoading: goalsLoading } = useActiveGoals();

  const isLoading = statsLoading || allowanceLoading || streakLoading || goalsLoading;

  // Get the primary active goal for progress display
  const primaryGoal = goals?.[0];

  // Calculate distances in km
  const currentDistanceKm = (todayStats?.totalDistance ?? 0) / 1000;
  const targetDistanceKm = primaryGoal?.targetValue ?? 2; // Default 2km if no goal

  // Calculate screen time progress
  const earnedMinutes = allowance?.earnedMinutes ?? 0;
  const targetMinutes = primaryGoal?.rewardMinutes ?? 30;

  // Pull to refresh handler
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: queryKeys.activities.today() }),
      queryClient.invalidateQueries({ queryKey: queryKeys.allowances.today() }),
      queryClient.invalidateQueries({ queryKey: queryKeys.streaks.current() }),
      queryClient.invalidateQueries({ queryKey: queryKeys.goals.active() }),
    ]);
    setRefreshing(false);
  }, [queryClient]);

  // Navigation handlers
  const handleSettingsPress = () => {
    router.push('/(app)/(tabs)/profile');
  };

  const handleStreakPress = () => {
    router.push('/(app)/streak');
  };

  const handleLogManual = () => {
    router.push('/(app)/log-activity');
  };

  const handleStartGps = () => {
    // TODO: Implement GPS tracking
    console.log('Start GPS tracking');
  };

  // Get user's first name
  const userName = user?.firstName ?? 'there';

  if (isLoading) {
    return (
      <View
        className="flex-1 bg-background-primary items-center justify-center"
        style={{ paddingTop: insets.top }}
      >
        <ActivityIndicator size="large" color="#00f5d4" />
        <Text className="text-gray-400 mt-4">Loading your dashboard...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background-primary" style={{ paddingTop: insets.top }}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 20, paddingBottom: insets.bottom + 100 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#00f5d4"
            colors={['#00f5d4']}
          />
        }
      >
        {/* Header */}
        <DashboardHeader userName={userName} onSettingsPress={handleSettingsPress} />

        {/* Progress Ring Card */}
        <View className="mt-6 p-6 rounded-3xl bg-background-secondary border border-border-subtle">
          <ProgressRing current={currentDistanceKm} target={targetDistanceKm} />

          {/* Stats row below ring */}
          <View className="flex-row items-center justify-between mt-6 pt-4 border-t border-border-subtle">
            <ScreenTimeEarned earnedMinutes={earnedMinutes} targetMinutes={targetMinutes} />
            <ActivityBreakdown
              walkDistanceKm={currentDistanceKm * 0.6} // TODO: Get actual breakdown from API
              runDistanceKm={currentDistanceKm * 0.4}
            />
          </View>
        </View>

        {/* Streak Banner */}
        <View className="mt-4">
          <StreakBanner
            currentStreak={streak?.currentStreak ?? 0}
            multiplier={streak?.multiplier ?? 1}
            onPress={handleStreakPress}
          />
        </View>

        {/* Balance Card */}
        <View className="mt-4">
          <BalanceCard
            earnedMinutes={allowance?.earnedMinutes ?? 0}
            bonusMinutes={allowance?.bonusMinutes ?? 0}
            usedMinutes={allowance?.usedMinutes ?? 0}
          />
        </View>

        {/* Quick Actions */}
        <View className="mt-6">
          <QuickActions onLogManual={handleLogManual} onStartGps={handleStartGps} />
        </View>
      </ScrollView>
    </View>
  );
}
