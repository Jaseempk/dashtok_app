import { View, Text } from 'react-native';
import { Icon, IconName } from '@/components/ui';

interface StatItem {
  label: string;
  value: string;
  unit?: string;
  icon: IconName;
  color: string;
}

interface StatsGridProps {
  stats: StatItem[];
}

export function StatsGrid({ stats }: StatsGridProps) {
  return (
    <View className="flex-row flex-wrap gap-3">
      {stats.map((stat, index) => (
        <View
          key={index}
          className="flex-1 min-w-[45%] p-4 rounded-2xl bg-background-secondary border border-border-subtle"
        >
          <View className="flex-row items-center gap-2 mb-2">
            <Icon name={stat.icon} size="sm" color={stat.color} />
            <Text className="text-xs text-gray-400 font-medium tracking-wide">
              {stat.label}
            </Text>
          </View>
          <View className="flex-row items-baseline">
            <Text className="text-2xl font-bold text-white">{stat.value}</Text>
            {stat.unit && (
              <Text className="text-sm text-gray-400 ml-1">{stat.unit}</Text>
            )}
          </View>
        </View>
      ))}
    </View>
  );
}

// Helper to format activity stats for the grid
export function formatActivityStats(activity: {
  durationSeconds: number;
  distanceMeters: number;
  steps: number | null;
  calories: number | null;
}): StatItem[] {
  const durationMinutes = Math.floor(activity.durationSeconds / 60);
  const durationSecs = activity.durationSeconds % 60;
  const durationStr = `${durationMinutes}:${durationSecs.toString().padStart(2, '0')}`;

  // Calculate pace (min/km)
  const distanceKm = activity.distanceMeters / 1000;
  const paceMinutes = distanceKm > 0 ? activity.durationSeconds / 60 / distanceKm : 0;
  const paceMin = Math.floor(paceMinutes);
  const paceSec = Math.round((paceMinutes - paceMin) * 60);
  const paceStr = `${paceMin}:${paceSec.toString().padStart(2, '0')}`;

  const stats: StatItem[] = [
    {
      label: 'DURATION',
      value: durationStr,
      icon: 'stopwatch',
      color: '#00f5d4',
    },
    {
      label: 'PACE',
      value: paceStr,
      unit: '/km',
      icon: 'speedometer',
      color: '#22d3ee',
    },
  ];

  if (activity.steps !== null) {
    stats.push({
      label: 'STEPS',
      value: activity.steps.toLocaleString(),
      icon: 'footsteps',
      color: '#00f5d4',
    });
  }

  if (activity.calories !== null) {
    stats.push({
      label: 'CALORIES',
      value: activity.calories.toString(),
      icon: 'flame',
      color: '#f97316',
    });
  }

  return stats;
}
