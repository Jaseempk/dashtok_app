import { View, Text } from 'react-native';
import { Icon } from '@/components/ui';

interface ActivityBreakdownProps {
  walkDistanceKm: number;
  runDistanceKm: number;
}

export function ActivityBreakdown({ walkDistanceKm, runDistanceKm }: ActivityBreakdownProps) {
  return (
    <View className="gap-1">
      <View className="flex-row items-center gap-2">
        <Icon name="walk" size="sm" color="#00f5d4" />
        <Text className="text-sm text-gray-300">{walkDistanceKm.toFixed(1)} km</Text>
      </View>
      <View className="flex-row items-center gap-2">
        <Icon name="run" size="sm" color="#f97316" />
        <Text className="text-sm text-gray-300">{runDistanceKm.toFixed(1)} km</Text>
      </View>
    </View>
  );
}
