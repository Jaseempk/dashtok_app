import { View, Text, Pressable } from 'react-native';
import { Icon, Toggle } from '@/components/ui';
import { GoalProgress } from './GoalProgress';
import type { Goal, GoalWithProgress } from '../types/goal.types';

interface GoalCardProps {
  goal: Goal | GoalWithProgress;
  progress?: number; // 0-100, if not using GoalWithProgress
  onToggleActive?: (isActive: boolean) => void;
  onPress?: () => void;
  isUpdating?: boolean;
}

const ACTIVITY_ICONS = {
  walk: 'walk' as const,
  run: 'run' as const,
  any: 'footsteps' as const,
};

function formatGoalTitle(goal: Goal): string {
  const activityLabel = goal.activityType === 'any' ? 'Move' : goal.activityType === 'walk' ? 'Walk' : 'Run';
  const unitLabel = goal.targetUnit === 'steps' ? 'steps' : goal.targetUnit;
  const frequency = goal.goalType === 'daily' ? 'daily' : 'weekly';

  return `${activityLabel} ${goal.targetValue} ${unitLabel} ${frequency}`;
}

export function GoalCard({
  goal,
  progress,
  onToggleActive,
  onPress,
  isUpdating = false,
}: GoalCardProps) {
  const displayProgress = 'currentProgress' in goal ? goal.currentProgress : progress ?? 0;
  const progressLabel = goal.goalType === 'daily' ? "Today's Progress" : 'Weekly Progress';

  return (
    <Pressable
      onPress={onPress}
      className="bg-background-secondary rounded-2xl p-4 border border-border-subtle"
      style={{ opacity: isUpdating ? 0.7 : 1 }}
    >
      <View className="flex-row items-start justify-between">
        <View className="flex-1">
          <Text className="text-lg font-semibold text-white mb-1">
            {formatGoalTitle(goal)}
          </Text>
          <View className="flex-row items-center">
            <Icon name="trophy" size="sm" color="#f97316" />
            <Text className="text-sm text-secondary-500 ml-1 font-medium">
              {goal.rewardMinutes} min screen time
            </Text>
          </View>
        </View>

        {onToggleActive && (
          <Toggle
            value={goal.isActive}
            onValueChange={onToggleActive}
            disabled={isUpdating}
          />
        )}
      </View>

      <GoalProgress progress={displayProgress} label={progressLabel} />
    </Pressable>
  );
}
