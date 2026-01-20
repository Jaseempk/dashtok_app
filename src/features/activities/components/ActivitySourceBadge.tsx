import { View, Text } from 'react-native';
import { Icon, IconName } from '@/components/ui';
import type { ActivitySource } from '../types/activity.types';

interface ActivitySourceBadgeProps {
  source: ActivitySource;
}

const SOURCE_CONFIG: Record<ActivitySource, { label: string; icon: IconName; color: string; bgColor: string }> = {
  gps_tracked: {
    label: 'GPS',
    icon: 'shield-check',
    color: '#00f5d4',
    bgColor: 'bg-primary-500/20',
  },
  healthkit: {
    label: 'HEALTHKIT',
    icon: 'heart',
    color: '#a855f7',
    bgColor: 'bg-purple-500/20',
  },
  manual: {
    label: 'MANUAL',
    icon: 'hand',
    color: '#6b7280',
    bgColor: 'bg-gray-500/20',
  },
};

export function ActivitySourceBadge({ source }: ActivitySourceBadgeProps) {
  const config = SOURCE_CONFIG[source];

  return (
    <View className={`flex-row items-center gap-1 px-2 py-1 rounded-full ${config.bgColor}`}>
      <Icon name={config.icon} size="xs" color={config.color} />
      <Text style={{ color: config.color }} className="text-xs font-medium">
        {config.label}
      </Text>
    </View>
  );
}
