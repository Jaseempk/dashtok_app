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
  return (
    <View className="w-full">
      <Slider
        value={value}
        minimumValue={min}
        maximumValue={max}
        step={step}
        onValueChange={onChange}
        minimumTrackTintColor="#00f5d4"
        maximumTrackTintColor="#374151"
        thumbTintColor="#00f5d4"
        style={{ width: '100%', height: 40 }}
      />
      <View className="flex-row justify-between px-1 mt-1">
        <Text className="text-gray-500 text-xs">
          {min} {unit}
        </Text>
        <Text className="text-gray-500 text-xs">
          {max} {unit}
        </Text>
      </View>
    </View>
  );
}
