import { View, Text } from 'react-native';
import { AnimatedPressable } from '@/components/ui';
import * as Haptics from 'expo-haptics';

interface ChipOption<T> {
  value: T;
  label: string;
}

interface ChipSelectorProps<T extends string> {
  label?: string;
  options: ChipOption<T>[];
  value: T | null;
  onChange: (value: T) => void;
}

export function ChipSelector<T extends string>({
  label,
  options,
  value,
  onChange,
}: ChipSelectorProps<T>) {
  const handleSelect = (selected: T) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onChange(selected);
  };

  return (
    <View className="mb-6">
      {label && (
        <Text className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wider">
          {label}
        </Text>
      )}
      <View className="flex-row flex-wrap gap-2">
        {options.map((opt) => (
          <AnimatedPressable
            key={opt.value}
            onPress={() => handleSelect(opt.value)}
            className={`px-4 py-2.5 rounded-full border ${
              value === opt.value
                ? 'border-primary-500 bg-primary-500/15'
                : 'border-border-subtle bg-background-secondary'
            }`}
          >
            <Text
              className={
                value === opt.value
                  ? 'text-primary-500 font-medium'
                  : 'text-white'
              }
            >
              {opt.label}
            </Text>
          </AnimatedPressable>
        ))}
      </View>
    </View>
  );
}
