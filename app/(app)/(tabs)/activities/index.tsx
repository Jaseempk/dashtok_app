import { View, Text, Pressable, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FlashList } from '@shopify/flash-list';
import { useState, useMemo, useCallback } from 'react';
import { startOfDay, startOfWeek, startOfMonth } from 'date-fns';

import { Icon } from '@/components/ui';
import {
  useActivities,
  ActivityCard,
  FilterTabs,
  StatsSummaryBar,
  EmptyActivities,
  type Activity,
  type FilterPeriod,
  type ActivityFilters,
} from '@/features/activities';

function getFilterDates(period: FilterPeriod): { from?: string; to?: string } {
  const now = new Date();

  switch (period) {
    case 'today':
      return { from: startOfDay(now).toISOString() };
    case 'week':
      return { from: startOfWeek(now, { weekStartsOn: 1 }).toISOString() };
    case 'month':
      return { from: startOfMonth(now).toISOString() };
    case 'all':
    default:
      return {};
  }
}

export default function ActivitiesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [period, setPeriod] = useState<FilterPeriod>('week');
  const [refreshing, setRefreshing] = useState(false);

  // Build filters based on selected period
  const filters: ActivityFilters = useMemo(() => ({
    ...getFilterDates(period),
    limit: 50,
  }), [period]);

  const { data, isLoading, refetch } = useActivities(filters);

  // Calculate stats from activities
  const stats = useMemo(() => {
    if (!data?.data) return { totalDistance: 0, totalDuration: 0, count: 0 };

    return data.data.reduce(
      (acc, activity) => ({
        totalDistance: acc.totalDistance + activity.distanceMeters,
        totalDuration: acc.totalDuration + activity.durationSeconds,
        count: acc.count + 1,
      }),
      { totalDistance: 0, totalDuration: 0, count: 0 }
    );
  }, [data]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const handleActivityPress = (activity: Activity) => {
    router.push(`/(app)/(tabs)/activities/${activity.id}`);
  };

  const renderActivity = ({ item }: { item: Activity }) => (
    <View className="px-4 mb-3">
      <ActivityCard activity={item} onPress={() => handleActivityPress(item)} />
    </View>
  );

  return (
    <View className="flex-1 bg-background-primary" style={{ paddingTop: insets.top }}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-4">
        <Text className="text-2xl font-bold text-white">Activities</Text>
        <Pressable className="w-10 h-10 rounded-full bg-background-secondary items-center justify-center">
          <Icon name="filter" size="md" color="#00f5d4" />
        </Pressable>
      </View>

      {/* Filter Tabs */}
      <View className="px-4 mb-4">
        <FilterTabs selected={period} onSelect={setPeriod} />
      </View>

      {/* Stats Summary */}
      <View className="px-4 mb-4">
        <StatsSummaryBar
          distanceMeters={stats.totalDistance}
          durationSeconds={stats.totalDuration}
          count={stats.count}
        />
      </View>

      {/* Activities List */}
      <FlashList
        data={data?.data ?? []}
        renderItem={renderActivity}
        estimatedItemSize={100}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#00f5d4"
            colors={['#00f5d4']}
          />
        }
        ListEmptyComponent={
          isLoading ? null : (
            <EmptyActivities
              title={period === 'today' ? 'No activities today' : 'No activities found'}
              message="Log an activity or sync from your health app to see it here."
            />
          )
        }
      />
    </View>
  );
}
