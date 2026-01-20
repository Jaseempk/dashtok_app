import { View, Text, Pressable } from 'react-native';
import { format, isToday, isYesterday } from 'date-fns';
import { Icon } from '@/components/ui';
import { ActivitySourceBadge } from './ActivitySourceBadge';
import type { Activity } from '../types/activity.types';

interface ActivityCardProps {
  activity: Activity;
  onPress?: () => void;
}

function formatDistance(meters: number): string {
  const km = meters / 1000;
  return `${km.toFixed(1)} km`;
}

function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes} min`;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  if (isToday(date)) {
    return format(date, 'h:mm a');
  }
  if (isYesterday(date)) {
    return 'Yesterday';
  }
  return format(date, 'EEE, d MMM');
}

const ACTIVITY_CONFIG = {
  run: { icon: 'run' as const, color: '#f97316', bgColor: 'bg-secondary-500/20' },
  walk: { icon: 'walk' as const, color: '#00f5d4', bgColor: 'bg-primary-500/20' },
};

export function ActivityCard({ activity, onPress }: ActivityCardProps) {
  const config = ACTIVITY_CONFIG[activity.activityType];
  const activityLabel = activity.activityType.charAt(0).toUpperCase() + activity.activityType.slice(1);

  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center gap-4 p-4 rounded-2xl bg-background-secondary border border-border-subtle active:opacity-80"
    >
      {/* Icon */}
      <View className={`w-14 h-14 rounded-2xl ${config.bgColor} items-center justify-center`}>
        <Icon name={config.icon} size="lg" color={config.color} />
      </View>

      {/* Content */}
      <View className="flex-1">
        <Text className="text-lg font-bold text-white">
          {formatDistance(activity.distanceMeters)}
        </Text>
        <Text className="text-sm text-gray-400">
          {activityLabel} • {formatDuration(activity.durationSeconds)}
        </Text>
        <Text className="text-xs text-gray-500 mt-0.5">
          {formatDate(activity.startedAt)}
        </Text>
      </View>

      {/* Source Badge */}
      <ActivitySourceBadge source={activity.source} />
    </Pressable>
  );
}
