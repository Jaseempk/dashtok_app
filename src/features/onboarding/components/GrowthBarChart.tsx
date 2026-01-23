import { useEffect, useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withTiming,
  withSpring,
  Easing,
  interpolate,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

interface BarData {
  label: string;
  value: number;
  heightPercent: number;
}

interface GrowthBarChartProps {
  percentGain?: string;
}

const BAR_DATA: BarData[] = [
  { label: 'NOW', value: 0, heightPercent: 0.28 },
  { label: '', value: 50, heightPercent: 0.45 },
  { label: '', value: 100, heightPercent: 0.65 },
  { label: 'GOAL', value: 150, heightPercent: 0.85 },
];

const BAR_COLORS = [
  'bg-slate-700',
  'bg-teal-700',
  'bg-teal-500',
  'bg-primary-500',
];

function AnimatedBar({
  data,
  index,
  maxHeight,
  isLast,
}: {
  data: BarData;
  index: number;
  maxHeight: number;
  isLast: boolean;
}) {
  const [showTooltip, setShowTooltip] = useState(false);
  const animatedHeight = useSharedValue(0);
  const scale = useSharedValue(1);
  const tooltipOpacity = useSharedValue(0);

  useEffect(() => {
    // Staggered entrance animation
    animatedHeight.value = withDelay(
      index * 150,
      withTiming(data.heightPercent, {
        duration: 450,
        easing: Easing.out(Easing.cubic),
      })
    );
  }, []);

  const barStyle = useAnimatedStyle(() => ({
    height: interpolate(animatedHeight.value, [0, 1], [0, maxHeight]),
    transform: [{ scale: scale.value }],
  }));

  const tooltipStyle = useAnimatedStyle(() => ({
    opacity: tooltipOpacity.value,
    transform: [
      { translateY: interpolate(tooltipOpacity.value, [0, 1], [5, 0]) },
    ],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(1.05, { damping: 15 });
    tooltipOpacity.value = withTiming(1, { duration: 150 });
    setShowTooltip(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15 });
    tooltipOpacity.value = withTiming(0, { duration: 200 });
    setTimeout(() => setShowTooltip(false), 200);
  };

  return (
    <View className="flex-1 items-center">
      {/* Tooltip */}
      {showTooltip && (
        <Animated.View
          style={tooltipStyle}
          className="absolute -top-8 bg-background-secondary px-2 py-1 rounded-lg border border-border-subtle z-10"
        >
          <Text className="text-xs text-white font-medium">
            +{data.value}%
          </Text>
        </Animated.View>
      )}

      {/* Goal badge for last bar */}
      {isLast && (
        <View className="absolute -top-10 bg-white px-3 py-1.5 rounded-lg z-10">
          <Text className="text-[10px] font-bold text-background-primary tracking-wide">
            GOAL
          </Text>
        </View>
      )}

      {/* Bar container */}
      <View
        className="w-full justify-end"
        style={{ height: maxHeight }}
      >
        <Pressable
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          className="w-full"
        >
          <Animated.View
            style={barStyle}
            className={`w-full rounded-full ${BAR_COLORS[index]} ${
              isLast ? 'shadow-sm shadow-primary-500/30' : ''
            }`}
          >
            {/* Gradient overlay for depth */}
            <View className="absolute inset-0 rounded-full overflow-hidden">
              <View className="absolute inset-0 bg-gradient-to-t from-transparent to-white/10" />
            </View>
          </Animated.View>
        </Pressable>
      </View>

      {/* Label */}
      <Text
        className={`text-[10px] font-semibold uppercase tracking-wider mt-3 ${
          isLast ? 'text-primary-500' : data.label ? 'text-gray-500' : 'text-transparent'
        }`}
      >
        {data.label || '.'}
      </Text>
    </View>
  );
}

export function GrowthBarChart({ percentGain = '+150%' }: GrowthBarChartProps) {
  const maxHeight = 160;

  return (
    <View className="w-full">
      {/* Header */}
      <View className="flex-row justify-between items-center mb-6 px-1">
        <Text className="text-white text-sm font-semibold">
          Projected Growth
        </Text>
        <View className="flex-row items-center gap-1.5 bg-primary-500/10 px-3 py-1.5 rounded-full border border-primary-500/20">
          <Text className="text-primary-500 text-lg">⚡</Text>
          <Text className="text-[10px] text-primary-500 font-bold uppercase tracking-wide">
            {percentGain} Potential
          </Text>
        </View>
      </View>

      {/* Chart */}
      <View className="bg-background-secondary/50 rounded-3xl p-6 border border-border-subtle">
        {/* Grid lines */}
        <View className="absolute inset-x-6 top-6 bottom-16 flex flex-col justify-between pointer-events-none">
          <View className="w-full h-px bg-white/5" />
          <View className="w-full h-px bg-white/5" />
          <View className="w-full h-px bg-white/5" />
        </View>

        {/* Bars */}
        <View
          className="flex-row items-end gap-4 pt-12"
          style={{ height: maxHeight + 48 }}
        >
          {BAR_DATA.map((data, index) => (
            <AnimatedBar
              key={index}
              data={data}
              index={index}
              maxHeight={maxHeight}
              isLast={index === BAR_DATA.length - 1}
            />
          ))}
        </View>
      </View>
    </View>
  );
}
