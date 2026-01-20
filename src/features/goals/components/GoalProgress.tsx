import { View, Text } from 'react-native';

interface GoalProgressProps {
  progress: number; // 0-100
  label?: string;
}

export function GoalProgress({ progress, label = 'Progress' }: GoalProgressProps) {
  const clampedProgress = Math.min(100, Math.max(0, progress));

  return (
    <View className="mt-3">
      <View className="flex-row justify-between mb-1">
        <Text className="text-xs text-gray-400 uppercase tracking-wide">{label}</Text>
        <Text className="text-sm font-semibold text-primary-500">{Math.round(clampedProgress)}%</Text>
      </View>
      <View className="h-2 bg-background-tertiary rounded-full overflow-hidden">
        <View
          className="h-full bg-primary-500 rounded-full"
          style={{ width: `${clampedProgress}%` }}
        />
      </View>
    </View>
  );
}
