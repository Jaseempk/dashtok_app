import { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

interface ProgressStepsProps {
  current: number;
  total: number;
}

export function ProgressSteps({ current, total }: ProgressStepsProps) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withSpring(current / total, {
      damping: 20,
      stiffness: 90,
    });
  }, [current, total]);

  const animatedStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
  }));

  return (
    <View className="h-1.5 rounded-full bg-background-tertiary overflow-hidden">
      <Animated.View
        className="h-full rounded-full bg-primary-500"
        style={[
          animatedStyle,
          { shadowColor: '#00f5d4', shadowRadius: 4, shadowOpacity: 0.6 },
        ]}
      />
    </View>
  );
}
