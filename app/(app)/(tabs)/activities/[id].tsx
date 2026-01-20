import { View, Text, ScrollView, Pressable, Alert, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { format } from 'date-fns';

import { Icon } from '@/components/ui';
import {
  useActivity,
  useDeleteActivity,
  ActivitySourceBadge,
  StatsGrid,
  formatActivityStats,
} from '@/features/activities';

export default function ActivityDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const { data: activity, isLoading } = useActivity(id);
  const deleteActivity = useDeleteActivity();

  const handleBack = () => {
    router.back();
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Activity',
      'Are you sure you want to delete this activity? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteActivity.mutateAsync(id);
              router.back();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete activity. Please try again.');
            }
          },
        },
      ]
    );
  };

  if (isLoading || !activity) {
    return (
      <View
        className="flex-1 bg-background-primary items-center justify-center"
        style={{ paddingTop: insets.top }}
      >
        <ActivityIndicator size="large" color="#00f5d4" />
      </View>
    );
  }

  const distanceKm = activity.distanceMeters / 1000;
  const startTime = format(new Date(activity.startedAt), 'h:mm a');
  const endTime = format(new Date(activity.endedAt), 'h:mm a');
  const sourceLabel = activity.source === 'healthkit' ? 'HealthKit' : activity.source === 'gps_tracked' ? 'GPS' : 'Manual';
  const stats = formatActivityStats(activity);

  return (
    <View className="flex-1 bg-background-primary" style={{ paddingTop: insets.top }}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-4">
        <Pressable
          onPress={handleBack}
          className="w-10 h-10 rounded-full bg-background-secondary items-center justify-center"
        >
          <Icon name="arrow-back" size="md" color="#9ca3af" />
        </Pressable>
        <Text className="text-lg font-semibold text-white">Activity Details</Text>
        <Pressable
          onPress={handleDelete}
          disabled={deleteActivity.isPending}
          className="w-10 h-10 rounded-full bg-background-secondary items-center justify-center"
        >
          {deleteActivity.isPending ? (
            <ActivityIndicator size="small" color="#ef4444" />
          ) : (
            <Icon name="trash" size="md" color="#ef4444" />
          )}
        </Pressable>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 32 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Map Placeholder */}
        <View className="h-48 rounded-2xl bg-background-secondary border border-border-subtle items-center justify-center mb-6">
          <Text className="text-gray-500">300×300</Text>
          <Text className="text-xs text-gray-600 mt-1">Map coming soon</Text>
        </View>

        {/* Distance Display */}
        <View className="items-center mb-2">
          <View className="flex-row items-baseline">
            <Text className="text-5xl font-bold text-white">{distanceKm.toFixed(1)}</Text>
            <Text className="text-2xl text-primary-500 ml-2">km</Text>
          </View>
          <Text className="text-sm text-primary-500 tracking-widest mt-1">TOTAL DISTANCE</Text>
        </View>

        {/* Time & Source */}
        <View className="items-center mb-8">
          <View className="flex-row items-center gap-2 px-4 py-2 rounded-full bg-background-secondary">
            <Icon name="time" size="sm" color="#6b7280" />
            <Text className="text-sm text-gray-400">
              {startTime} - {endTime} • {sourceLabel}
            </Text>
          </View>
        </View>

        {/* Stats Grid */}
        <StatsGrid stats={stats} />

        {/* Progress & Rewards Section */}
        <View className="mt-6">
          <Text className="text-lg font-semibold text-white mb-3">Progress & Rewards</Text>
          <View className="flex-row items-center gap-3 p-4 rounded-2xl bg-background-secondary border border-border-subtle">
            <View className="w-10 h-10 rounded-xl bg-primary-500/20 items-center justify-center">
              <Icon name="flag" size="md" color="#00f5d4" />
            </View>
            <View className="flex-1">
              <Text className="text-base font-semibold text-white">Daily Goal</Text>
              <Text className="text-sm text-gray-400">
                +{distanceKm.toFixed(1)} km contribution
              </Text>
            </View>
            <View className="w-8 h-8 rounded-full border-2 border-primary-500/30">
              {/* Progress indicator placeholder */}
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
