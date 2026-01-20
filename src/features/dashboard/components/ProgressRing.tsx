import { View, Text } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Animated, {
  useAnimatedProps,
  useSharedValue,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { useEffect } from 'react';
import { colors } from '@/styles/tokens';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface ProgressRingProps {
  current: number; // Current distance in km
  target: number; // Target distance in km
  size?: number;
  strokeWidth?: number;
}

export function ProgressRing({
  current,
  target,
  size = 220,
  strokeWidth = 12,
}: ProgressRingProps) {
  const progress = useSharedValue(0);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  // Calculate percentage (capped at 100%)
  const percentage = Math.min((current / target) * 100, 100);

  useEffect(() => {
    progress.value = withTiming(percentage / 100, {
      duration: 1000,
      easing: Easing.out(Easing.cubic),
    });
  }, [percentage]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference * (1 - progress.value),
  }));

  return (
    <View className="items-center justify-center">
      {/* SVG Ring */}
      <Svg width={size} height={size}>
        {/* Background ring */}
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={colors.background.tertiary}
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Progress ring */}
        <AnimatedCircle
          cx={center}
          cy={center}
          r={radius}
          stroke={colors.primary[500]}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeLinecap="round"
          strokeDasharray={circumference}
          animatedProps={animatedProps}
          rotation="-90"
          origin={`${center}, ${center}`}
        />
      </Svg>

      {/* Center content */}
      <View className="absolute items-center justify-center">
        <Text className="text-xs font-semibold text-gray-400 tracking-widest mb-1">
          DISTANCE
        </Text>
        <View className="flex-row items-baseline">
          <Text className="text-5xl font-bold text-white">
            {current.toFixed(1)}
          </Text>
          <Text className="text-xl text-gray-400 ml-1">
            / {target.toFixed(1)} km
          </Text>
        </View>
        <View className="mt-3 px-4 py-1.5 rounded-full bg-primary-500/20 border border-primary-500/40">
          <Text className="text-sm font-semibold text-primary-500">
            {Math.round(percentage)}% Complete
          </Text>
        </View>
      </View>
    </View>
  );
}
