import { useState } from 'react';
import { View, Text } from 'react-native';
import {
  useAnimatedProps,
  useAnimatedReaction,
  SharedValue,
  runOnJS,
} from 'react-native-reanimated';
import Animated from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface CircularProgressProps {
  progress: SharedValue<number>; // Animated 0-100
  size?: number;
  strokeWidth?: number;
  showPercentage?: boolean;
}

export function CircularProgress({
  progress,
  size = 180,
  strokeWidth = 8,
  showPercentage = true,
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const [displayValue, setDisplayValue] = useState(0);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference - (progress.value / 100) * circumference,
  }));

  // Update display value on JS thread
  useAnimatedReaction(
    () => Math.round(progress.value),
    (value) => {
      runOnJS(setDisplayValue)(value);
    },
    [progress]
  );

  return (
    <View className="items-center justify-center">
      <Svg width={size} height={size}>
        {/* Background circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#1f2937"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress circle */}
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#00f5d4"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          animatedProps={animatedProps}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>

      {showPercentage && (
        <View className="absolute items-center">
          <Text className="text-5xl font-bold text-white">{displayValue}</Text>
          <Text className="text-primary-500 text-sm font-medium tracking-wider">
            PROCESSING
          </Text>
        </View>
      )}
    </View>
  );
}
