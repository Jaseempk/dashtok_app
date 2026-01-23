import { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withRepeat,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { Icon } from '@/components/ui';

interface ProfileBadgeProps {
  size?: number;
}

export function ProfileBadge({ size = 120 }: ProfileBadgeProps) {
  const scale = useSharedValue(0.8);
  const opacity = useSharedValue(0);
  const ringScale = useSharedValue(0.9);
  const pulseOpacity = useSharedValue(0.3);

  useEffect(() => {
    // Badge entrance animation
    scale.value = withDelay(
      200,
      withTiming(1, {
        duration: 400,
        easing: Easing.out(Easing.back(1.5)),
      })
    );
    opacity.value = withDelay(
      200,
      withTiming(1, { duration: 300 })
    );

    // Ring scale animation
    ringScale.value = withDelay(
      400,
      withTiming(1, {
        duration: 500,
        easing: Easing.out(Easing.cubic),
      })
    );

    // Subtle pulse animation (not too aggressive)
    pulseOpacity.value = withDelay(
      800,
      withRepeat(
        withSequence(
          withTiming(0.5, { duration: 2000 }),
          withTiming(0.3, { duration: 2000 })
        ),
        -1,
        true
      )
    );
  }, []);

  const badgeStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const ringStyle = useAnimatedStyle(() => ({
    transform: [{ scale: ringScale.value }],
  }));

  const pulseStyle = useAnimatedStyle(() => ({
    opacity: pulseOpacity.value,
  }));

  return (
    <View
      className="items-center justify-center"
      style={{ width: size, height: size }}
    >
      {/* Subtle pulse background */}
      <Animated.View
        style={[pulseStyle, { width: size * 1.3, height: size * 1.3 }]}
        className="absolute rounded-full bg-primary-500/20"
      />

      {/* Outer ring */}
      <Animated.View
        style={[ringStyle, { width: size * 1.1, height: size * 1.1 }]}
        className="absolute rounded-full border border-primary-500/30"
      />

      {/* Main badge container */}
      <Animated.View
        style={[badgeStyle, { width: size, height: size }]}
        className="rounded-full bg-background-secondary border border-border-subtle items-center justify-center"
      >
        {/* Inner gradient effect */}
        <View className="absolute inset-2 rounded-full bg-gradient-to-br from-primary-500/10 to-transparent" />

        {/* Trophy/Award icon */}
        <View className="items-center justify-center">
          <Icon name="trophy" size="3xl" color="#00f5d4" />
        </View>

        {/* Checkmark badge overlay */}
        <View className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-primary-500 items-center justify-center border-2 border-background-primary">
          <Icon name="check" size="sm" color="#0a0f1a" />
        </View>
      </Animated.View>
    </View>
  );
}
