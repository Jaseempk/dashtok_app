import { View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { QuestionCard } from './QuestionCard';
import type { Frequency } from '../types/onboarding.types';

const FREQUENCY_OPTIONS: { value: Frequency; label: string }[] = [
  { value: 0, label: 'Not at all' },
  { value: 1, label: 'Several days' },
  { value: 2, label: 'More than half the days' },
  { value: 3, label: 'Nearly every day' },
];

interface FrequencySelectorProps {
  value: Frequency | null;
  onChange: (value: Frequency) => void;
  onComplete?: () => void;
}

export function FrequencySelector({
  value,
  onChange,
  onComplete,
}: FrequencySelectorProps) {
  const handleSelect = (freq: Frequency) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onChange(freq);

    if (onComplete) {
      setTimeout(() => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        onComplete();
      }, 400);
    }
  };

  return (
    <View className="gap-3">
      {FREQUENCY_OPTIONS.map((opt) => (
        <QuestionCard
          key={opt.value}
          label={opt.label}
          selected={value === opt.value}
          onPress={() => handleSelect(opt.value)}
          variant="radio"
        />
      ))}
    </View>
  );
}
