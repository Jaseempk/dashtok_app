import { View, Text } from 'react-native';
import Slider from '@react-native-community/slider';

interface DistanceSliderProps {
  value: number;
  min?: number;
  max?: number;
  step?: number;
  unit?: 'km' | 'miles';
  onChange: (value: number) => void;
}

export function DistanceSlider({
  value,
  min = 0.5,
  max = 10,
  step = 0.5,
  unit = 'km',
  onChange,
}: DistanceSliderProps) {
  const unitLabel = unit.toUpperCase();

  return (
    <View className="w-full">
      <Slider
        value={value}
        minimumValue={min}
        maximumValue={max}
        step={step}
        onValueChange={onChange}
        minimumTrackTintColor="#00f5d4"
        maximumTrackTintColor="#1e293b"
        thumbTintColor="#00f5d4"
        style={{ width: '100%', height: 40 }}
      />
      <View className="flex-row justify-between mt-2">
        <Text className="text-[10px] text-gray-500 tracking-wider font-mono">
          {min} {unitLabel}
        </Text>
        <Text className="text-[10px] text-gray-500 tracking-wider font-mono">
          {max} {unitLabel}
        </Text>
      </View>
    </View>
  );
}
