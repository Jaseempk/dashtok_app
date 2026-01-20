import { ReactNode } from 'react';
import { Pressable, PressableProps } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

type HapticType = 'light' | 'medium' | 'heavy' | false;

interface AnimatedPressableProps extends PressableProps {
  children: ReactNode;
  haptic?: HapticType;
  scaleValue?: number;
}

const SPRING_CONFIG = {
  damping: 15,
  stiffness: 150,
  mass: 0.5,
};

const HAPTIC_MAP = {
  light: Haptics.ImpactFeedbackStyle.Light,
  medium: Haptics.ImpactFeedbackStyle.Medium,
  heavy: Haptics.ImpactFeedbackStyle.Heavy,
} as const;

const triggerHaptic = (type: Exclude<HapticType, false>) => {
  Haptics.impactAsync(HAPTIC_MAP[type]);
};

export function AnimatedPressable({
  children,
  haptic = 'light',
  scaleValue = 0.97,
  disabled,
  onPressIn,
  onPressOut,
  style,
  ...props
}: AnimatedPressableProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn: PressableProps['onPressIn'] = (e) => {
    scale.value = withSpring(scaleValue, SPRING_CONFIG);
    if (!disabled && haptic) {
      triggerHaptic(haptic);
    }
    onPressIn?.(e);
  };

  const handlePressOut: PressableProps['onPressOut'] = (e) => {
    scale.value = withSpring(1, SPRING_CONFIG);
    onPressOut?.(e);
  };

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        style={style}
        {...props}
      >
        {children}
      </Pressable>
    </Animated.View>
  );
}
