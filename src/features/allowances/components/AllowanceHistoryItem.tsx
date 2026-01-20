import { View, Text } from 'react-native';
import { Icon } from '@/components/ui';
import type { Allowance } from '../types/allowance.types';

interface AllowanceHistoryItemProps {
  allowance: Allowance;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (dateStr === today.toISOString().split('T')[0]) {
    return 'Today';
  }
  if (dateStr === yesterday.toISOString().split('T')[0]) {
    return 'Yesterday';
  }

  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

export function AllowanceHistoryItem({ allowance }: AllowanceHistoryItemProps) {
  const total = allowance.earnedMinutes + allowance.bonusMinutes;
  const wasUnlocked = allowance.isUnlocked;

  return (
    <View className="flex-row items-center py-3 border-b border-border-subtle">
      <View
        className={`w-10 h-10 rounded-full items-center justify-center mr-3 ${
          wasUnlocked ? 'bg-primary-500/20' : 'bg-background-tertiary'
        }`}
      >
        <Icon
          name={wasUnlocked ? 'check-circle' : 'close'}
          size="md"
          color={wasUnlocked ? '#00f5d4' : '#6b7280'}
        />
      </View>
      <View className="flex-1">
        <Text className="text-base text-white">{formatDate(allowance.date)}</Text>
        <Text className="text-xs text-gray-400">
          {wasUnlocked ? 'Goal completed' : 'Incomplete'}
        </Text>
      </View>
      <View className="items-end">
        <Text className="text-base font-semibold text-white">{total}m</Text>
        {allowance.bonusMinutes > 0 && (
          <Text className="text-xs text-secondary-500">+{allowance.bonusMinutes}m bonus</Text>
        )}
      </View>
    </View>
  );
}
