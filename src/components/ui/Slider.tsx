import { View, Text } from 'react-native';
import RNSlider from '@react-native-community/slider';
import { colors } from '@/styles/tokens';

interface SliderProps {
  value: number;
  onValueChange: (value: number) => void;
  minimumValue: number;
  maximumValue: number;
  step?: number;
  label?: string;
  valueLabel?: string;
  minLabel?: string;
  maxLabel?: string;
}

export function Slider({
  value,
  onValueChange,
  minimumValue,
  maximumValue,
  step = 1,
  label,
  valueLabel,
  minLabel,
  maxLabel,
}: SliderProps) {
  return (
    <View className="mb-4">
      {(label || valueLabel) && (
        <View className="flex-row justify-between items-center mb-2">
          {label && <Text className="text-base font-medium text-white">{label}</Text>}
          {valueLabel && (
            <Text className="text-2xl font-bold text-primary-500">{valueLabel}</Text>
          )}
        </View>
      )}

      <RNSlider
        value={value}
        onValueChange={onValueChange}
        minimumValue={minimumValue}
        maximumValue={maximumValue}
        step={step}
        minimumTrackTintColor={colors.primary[500]}
        maximumTrackTintColor={colors.background.tertiary}
        thumbTintColor={colors.primary[500]}
        style={{ height: 40 }}
      />

      {(minLabel || maxLabel) && (
        <View className="flex-row justify-between mt-1">
          <Text className="text-xs text-gray-500">{minLabel}</Text>
          <Text className="text-xs text-gray-500">{maxLabel}</Text>
        </View>
      )}
    </View>
  );
}
