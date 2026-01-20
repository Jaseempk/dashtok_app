import { View, Text } from 'react-native';
import { Icon, Button } from '@/components/ui';

interface EmptyGoalsProps {
  onCreateGoal: () => void;
}

export function EmptyGoals({ onCreateGoal }: EmptyGoalsProps) {
  return (
    <View className="flex-1 items-center justify-center px-8">
      {/* Target icon with rings */}
      <View className="relative items-center justify-center mb-8">
        <View className="absolute w-40 h-40 rounded-full border border-border-subtle" />
        <View className="absolute w-32 h-32 rounded-full border border-border-subtle" />
        <View className="w-20 h-20 rounded-full bg-primary-500/10 items-center justify-center">
          <Icon name="flag" size={32} color="#00f5d4" />
        </View>
        {/* Decorative dots */}
        <View className="absolute -top-2 w-2 h-2 rounded-full bg-primary-500/50" />
        <View className="absolute -bottom-2 w-2 h-2 rounded-full bg-primary-500/50" />
        <View className="absolute -left-2 w-2 h-2 rounded-full bg-primary-500/50" />
        <View className="absolute -right-2 w-2 h-2 rounded-full bg-primary-500/50" />
      </View>

      <Text className="text-2xl font-bold text-white mb-3">No goals set</Text>
      <Text className="text-base text-gray-400 text-center mb-8 leading-6">
        Create a goal to start earning screen time. Stay focused and track your progress.
      </Text>

      <Button onPress={onCreateGoal} className="w-full">
        CREATE YOUR FIRST GOAL
      </Button>
    </View>
  );
}
