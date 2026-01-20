import { View, Text } from 'react-native';
import { Icon } from '@/components/ui';

interface StatsSummaryBarProps {
  distanceMeters: number;
  durationSeconds: number;
  count: number;
}

function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${hours}h ${minutes}m`;
}

function formatDistance(meters: number): string {
  const km = meters / 1000;
  return `${km.toFixed(1)}`;
}

export function StatsSummaryBar({ distanceMeters, durationSeconds, count }: StatsSummaryBarProps) {
  return (
    <View className="flex-row gap-3">
      {/* Distance */}
      <View className="flex-1 p-3 rounded-xl bg-background-secondary border border-border-subtle items-center">
        <View className="flex-row items-center gap-1 mb-1">
          <Icon name="stats" size="xs" color="#00f5d4" />
          <Text className="text-xs text-gray-400 font-medium">DIST</Text>
        </View>
        <View className="flex-row items-baseline">
          <Text className="text-xl font-bold text-white">{formatDistance(distanceMeters)}</Text>
          <Text className="text-sm text-gray-400 ml-0.5">km</Text>
        </View>
      </View>

      {/* Time */}
      <View className="flex-1 p-3 rounded-xl bg-background-secondary border border-border-subtle items-center">
        <View className="flex-row items-center gap-1 mb-1">
          <Icon name="stopwatch" size="xs" color="#a855f7" />
          <Text className="text-xs text-gray-400 font-medium">TIME</Text>
        </View>
        <Text className="text-xl font-bold text-white">{formatDuration(durationSeconds)}</Text>
      </View>

      {/* Count */}
      <View className="flex-1 p-3 rounded-xl bg-background-secondary border border-border-subtle items-center">
        <View className="flex-row items-center gap-1 mb-1">
          <Icon name="flame" size="xs" color="#f97316" />
          <Text className="text-xs text-gray-400 font-medium">COUNT</Text>
        </View>
        <Text className="text-xl font-bold text-white">{count}</Text>
      </View>
    </View>
  );
}
