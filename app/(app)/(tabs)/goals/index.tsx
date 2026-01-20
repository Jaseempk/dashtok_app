import { View, Text, ScrollView, Pressable, RefreshControl, ActivityIndicator, LayoutAnimation, Platform, UIManager } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useState, useCallback, useMemo } from 'react';

import { Icon } from '@/components/ui';
import {
  useGoals,
  useUpdateGoal,
  GoalCard,
  AddGoalCard,
  DailyTipCard,
  EmptyGoals,
  type Goal,
} from '@/features/goals';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function GoalsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState(false);
  const [inactiveExpanded, setInactiveExpanded] = useState(false);
  const [updatingGoalId, setUpdatingGoalId] = useState<string | null>(null);

  const { data: goals, isLoading, refetch } = useGoals();
  const updateGoal = useUpdateGoal();

  // Separate active and inactive goals
  const { activeGoals, inactiveGoals } = useMemo(() => {
    if (!goals) return { activeGoals: [], inactiveGoals: [] };
    return {
      activeGoals: goals.filter((g) => g.isActive),
      inactiveGoals: goals.filter((g) => !g.isActive),
    };
  }, [goals]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const handleCreateGoal = () => {
    router.push('/(app)/create-goal');
  };

  const handleToggleActive = (goal: Goal, isActive: boolean) => {
    // Animate layout change
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

    // Track which card is updating
    setUpdatingGoalId(goal.id);

    // Auto-expand inactive section when deactivating a goal
    if (!isActive) {
      setInactiveExpanded(true);
    }

    updateGoal.mutate(
      { id: goal.id, data: { isActive } },
      { onSettled: () => setUpdatingGoalId(null) }
    );
  };

  const handleGoalPress = (goal: Goal) => {
    // For now, just toggle - could navigate to detail/edit later
    // router.push(`/(app)/(tabs)/goals/${goal.id}`);
  };

  // Show empty state if no goals at all
  if (!isLoading && goals && goals.length === 0) {
    return (
      <View className="flex-1 bg-background-primary" style={{ paddingTop: insets.top }}>
        <View className="flex-row items-center justify-between px-4 py-4">
          <Text className="text-2xl font-bold text-white">Goals</Text>
        </View>
        <EmptyGoals onCreateGoal={handleCreateGoal} />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background-primary" style={{ paddingTop: insets.top }}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-4">
        <Text className="text-2xl font-bold text-white">Goals</Text>
        <Pressable
          onPress={handleCreateGoal}
          className="w-10 h-10 rounded-full border border-primary-500 items-center justify-center"
        >
          <Icon name="add" size="md" color="#00f5d4" />
        </Pressable>
      </View>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#00f5d4" />
        </View>
      ) : (
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 100 }}
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
          {/* Active Goals Section */}
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-sm font-semibold text-gray-400 uppercase tracking-wide">
              Active Goals
            </Text>
            <View className="px-3 py-1 rounded-full bg-primary-500/20">
              <Text className="text-xs font-medium text-primary-500">
                {activeGoals.length} Active
              </Text>
            </View>
          </View>

          {/* Active Goal Cards */}
          <View className="gap-3 mb-6">
            {activeGoals.map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                progress={0} // TODO: Calculate from activities
                onToggleActive={(isActive) => handleToggleActive(goal, isActive)}
                onPress={() => handleGoalPress(goal)}
                isUpdating={updatingGoalId === goal.id}
              />
            ))}
          </View>

          {/* Add New Goal Card */}
          <View className="mb-6">
            <AddGoalCard onPress={handleCreateGoal} />
          </View>

          {/* Daily Tip Card */}
          <View className="mb-6">
            <DailyTipCard />
          </View>

          {/* Inactive Goals Section */}
          {inactiveGoals.length > 0 && (
            <View>
              <Pressable
                onPress={() => setInactiveExpanded(!inactiveExpanded)}
                className="flex-row items-center justify-between py-3"
              >
                <View className="flex-row items-center gap-2">
                  <Icon name="flag" size="sm" color="#6b7280" />
                  <Text className="text-sm text-gray-400">
                    Inactive Goals ({inactiveGoals.length})
                  </Text>
                </View>
                <Icon
                  name={inactiveExpanded ? 'chevron-up' : 'chevron-down'}
                  size="sm"
                  color="#6b7280"
                />
              </Pressable>

              {inactiveExpanded && (
                <View className="gap-3 mt-2">
                  {inactiveGoals.map((goal) => (
                    <GoalCard
                      key={goal.id}
                      goal={goal}
                      progress={0}
                      onToggleActive={(isActive) => handleToggleActive(goal, isActive)}
                      onPress={() => handleGoalPress(goal)}
                      isUpdating={updatingGoalId === goal.id}
                    />
                  ))}
                </View>
              )}
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
}
