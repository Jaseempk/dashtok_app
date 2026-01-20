import { View, Text } from 'react-native';
import { Icon } from '@/components/ui';

const TIPS = [
  'Consistent small steps lead to big changes. Try stacking habits for better adherence.',
  'Start with just one daily goal. Small wins build the momentum you need for big changes.',
  'Morning workouts boost energy all day. Try moving before checking your phone.',
  'Track your progress weekly. Seeing improvement keeps motivation high.',
  'Rest days matter. Recovery is part of the journey, not a break from it.',
];

interface DailyTipCardProps {
  tipIndex?: number;
}

export function DailyTipCard({ tipIndex }: DailyTipCardProps) {
  // Use day of year for consistent daily tip, or provided index
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24)
  );
  const index = tipIndex ?? dayOfYear % TIPS.length;
  const tip = TIPS[index];

  return (
    <View className="bg-background-secondary/50 rounded-2xl p-4 flex-row items-start gap-3 border border-border-subtle">
      <View className="w-10 h-10 rounded-full bg-yellow-500/20 items-center justify-center">
        <Icon name="bulb" size="md" color="#eab308" />
      </View>
      <View className="flex-1">
        <Text className="text-base font-semibold text-white mb-1">Daily Tip</Text>
        <Text className="text-sm text-gray-400 leading-5">{tip}</Text>
      </View>
    </View>
  );
}
