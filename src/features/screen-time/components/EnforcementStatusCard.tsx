import { View, Text } from 'react-native';
import { Icon } from '@/components/ui';
import type { EnforcementStatus, EnforcementReason } from '../types/screenTime.types';

interface EnforcementStatusCardProps {
  status: EnforcementStatus | undefined;
  isLoading?: boolean;
}

interface StatusConfig {
  icon: 'lock-closed' | 'lock-open' | 'alert-circle' | 'checkmark-circle' | 'flame';
  title: string;
  description: string;
  bgColor: string;
  borderColor: string;
  iconColor: string;
}

function getStatusConfig(status: EnforcementStatus | undefined): StatusConfig {
  if (!status) {
    return {
      icon: 'alert-circle',
      title: 'Loading...',
      description: 'Checking enforcement status',
      bgColor: 'bg-gray-500/10',
      borderColor: 'border-gray-500/20',
      iconColor: '#9ca3af',
    };
  }

  const configs: Record<EnforcementReason, StatusConfig> = {
    goal_incomplete: {
      icon: 'lock-closed',
      title: 'Apps Locked',
      description: `Complete ${status.nextUnlockRequirement?.target ?? 0} ${status.nextUnlockRequirement?.unit ?? 'km'} to unlock`,
      bgColor: 'bg-yellow-500/10',
      borderColor: 'border-yellow-500/20',
      iconColor: '#f59e0b',
    },
    time_exhausted: {
      icon: 'flame',
      title: "Time's Up!",
      description: 'Earn more time by completing your goal',
      bgColor: 'bg-red-500/10',
      borderColor: 'border-red-500/20',
      iconColor: '#ef4444',
    },
    unlocked: {
      icon: 'lock-open',
      title: 'Apps Unlocked',
      description: `${status.remainingMinutes} minutes remaining`,
      bgColor: 'bg-primary-500/10',
      borderColor: 'border-primary-500/20',
      iconColor: '#00f5d4',
    },
    enforcement_disabled: {
      icon: 'alert-circle',
      title: 'Enforcement Disabled',
      description: 'Enable enforcement in settings',
      bgColor: 'bg-gray-500/10',
      borderColor: 'border-gray-500/20',
      iconColor: '#9ca3af',
    },
    no_blocked_apps: {
      icon: 'checkmark-circle',
      title: 'No Apps Blocked',
      description: 'Select apps to block in settings',
      bgColor: 'bg-gray-500/10',
      borderColor: 'border-gray-500/20',
      iconColor: '#9ca3af',
    },
  };

  return configs[status.reason];
}

/**
 * Card showing current enforcement status with appropriate styling.
 */
export function EnforcementStatusCard({ status, isLoading }: EnforcementStatusCardProps) {
  const config = getStatusConfig(status);

  if (isLoading) {
    return (
      <View className="p-4 rounded-xl bg-background-secondary border border-border-subtle">
        <View className="flex-row items-center gap-3">
          <View className="w-10 h-10 rounded-full bg-background-tertiary animate-pulse" />
          <View className="flex-1">
            <View className="h-4 w-24 bg-background-tertiary rounded animate-pulse mb-2" />
            <View className="h-3 w-40 bg-background-tertiary rounded animate-pulse" />
          </View>
        </View>
      </View>
    );
  }

  return (
    <View className={`p-4 rounded-xl ${config.bgColor} border ${config.borderColor}`}>
      <View className="flex-row items-center gap-3">
        <View
          className="w-10 h-10 rounded-full items-center justify-center"
          style={{ backgroundColor: `${config.iconColor}20` }}
        >
          <Icon name={config.icon} size="md" color={config.iconColor} />
        </View>
        <View className="flex-1">
          <Text className="text-base font-semibold text-white">
            {config.title}
          </Text>
          <Text className="text-sm text-gray-400">
            {config.description}
          </Text>
        </View>

        {/* Progress indicator for goal_incomplete */}
        {status?.reason === 'goal_incomplete' && status.nextUnlockRequirement && (
          <View className="items-end">
            <Text className="text-lg font-bold text-primary-500">
              {status.nextUnlockRequirement.percentComplete}%
            </Text>
            <Text className="text-xs text-gray-500">
              {status.nextUnlockRequirement.current.toFixed(1)}/{status.nextUnlockRequirement.target} {status.nextUnlockRequirement.unit}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}
