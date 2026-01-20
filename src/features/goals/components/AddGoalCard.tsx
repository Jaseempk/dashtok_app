import { View, Text, Pressable } from 'react-native';
import { Icon } from '@/components/ui';

interface AddGoalCardProps {
  onPress: () => void;
}

export function AddGoalCard({ onPress }: AddGoalCardProps) {
  return (
    <Pressable
      onPress={onPress}
      className="rounded-2xl p-6 items-center justify-center border-2 border-dashed border-primary-500/30"
      style={{ minHeight: 80 }}
    >
      <View className="flex-row items-center gap-2">
        <Icon name="add" size="md" color="#00f5d4" />
        <Text className="text-base font-medium text-primary-500">Add new goal</Text>
      </View>
    </Pressable>
  );
}
