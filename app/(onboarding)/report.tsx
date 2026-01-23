import { View, Text, ScrollView, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, Icon } from '@/components/ui';
import { useOnboardingStore } from '@/features/onboarding/store/onboardingStore';
import { PROFILE_CONTENT } from '@/features/onboarding/constants/content';
import { ProfileBadge, GrowthBarChart } from '@/features/onboarding/components';

export default function ReportScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { profileType } = useOnboardingStore();

  const profile = PROFILE_CONTENT[profileType ?? 'inconsistent-achiever'];

  // Animation values
  const badgeOpacity = useSharedValue(0);
  const titleOpacity = useSharedValue(0);
  const titleTranslateY = useSharedValue(15);
  const descriptionOpacity = useSharedValue(0);
  const successOpacity = useSharedValue(0);
  const chartOpacity = useSharedValue(0);

  useEffect(() => {
    // Staggered entrance animations
    badgeOpacity.value = withTiming(1, { duration: 400 });

    titleOpacity.value = withDelay(
      200,
      withTiming(1, { duration: 400, easing: Easing.out(Easing.cubic) })
    );
    titleTranslateY.value = withDelay(
      200,
      withTiming(0, { duration: 400, easing: Easing.out(Easing.cubic) })
    );

    descriptionOpacity.value = withDelay(400, withTiming(1, { duration: 400 }));
    successOpacity.value = withDelay(600, withTiming(1, { duration: 400 }));
    chartOpacity.value = withDelay(800, withTiming(1, { duration: 400 }));
  }, []);

  const badgeStyle = useAnimatedStyle(() => ({
    opacity: badgeOpacity.value,
  }));

  const titleStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ translateY: titleTranslateY.value }],
  }));

  const descriptionStyle = useAnimatedStyle(() => ({
    opacity: descriptionOpacity.value,
  }));

  const successStyle = useAnimatedStyle(() => ({
    opacity: successOpacity.value,
  }));

  const chartStyle = useAnimatedStyle(() => ({
    opacity: chartOpacity.value,
  }));

  const handleContinue = () => {
    router.push('/(onboarding)/solution');
  };

  const handleSkip = () => {
    router.push('/(onboarding)/activity-type');
  };

  return (
    <View
      className="flex-1 bg-background-primary"
      style={{ paddingTop: insets.top }}
    >
      {/* Header */}
      <View className="flex-row items-center justify-between px-6 py-4">
        <Pressable
          onPress={() => router.back()}
          className="w-11 h-11 items-center justify-center rounded-full active:bg-background-secondary"
        >
          <Icon name="arrow-back" size="lg" color="#9ca3af" />
        </Pressable>
        <Text className="text-xs font-semibold text-gray-400 tracking-wider uppercase">
          Analysis Report
        </Text>
        <Pressable onPress={handleSkip}>
          <Text className="text-primary-500 font-semibold text-sm">Skip</Text>
        </Pressable>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerClassName="px-6 pb-32"
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <View className="items-center pt-4 pb-8">
          {/* Analysis Complete Badge */}
          <Animated.View
            style={badgeStyle}
            className="flex-row items-center gap-2 px-4 py-2 rounded-full border border-border-subtle bg-background-secondary/50 mb-8"
          >
            <View className="w-1.5 h-1.5 rounded-full bg-primary-500" />
            <Text className="text-[10px] font-bold text-gray-300 tracking-widest uppercase">
              Analysis Complete
            </Text>
          </Animated.View>

          {/* Profile Badge */}
          <ProfileBadge size={110} />

          {/* Profile Title */}
          <Animated.View style={titleStyle} className="items-center mt-6 mb-6">
            <Text className="text-3xl font-medium text-white tracking-tight">
              {profile.title}
            </Text>
            <Text className="text-4xl font-normal text-primary-500 italic">
              {profile.subtitle}
            </Text>
          </Animated.View>

          {/* Description Card */}
          <Animated.View
            style={descriptionStyle}
            className="w-full rounded-2xl bg-background-secondary/60 border border-border-subtle p-5"
          >
            <Text className="text-sm text-gray-300 leading-relaxed text-center">
              {profile.description}
            </Text>
          </Animated.View>
        </View>

        {/* Success Rate Card */}
        <Animated.View
          style={successStyle}
          className="rounded-2xl bg-background-secondary/60 border border-border-subtle p-5 mb-8"
        >
          <View className="flex-row items-center gap-4">
            <View className="flex-row items-center gap-2">
              <Text className="text-5xl font-bold text-transparent bg-clip-text"
                style={{
                  color: '#00f5d4',
                }}
              >
                {profile.successRate}%
              </Text>
              <Icon name="chart" size="xl" color="#00f5d4" />
            </View>
          </View>
          <Text className="text-xs text-gray-400 mt-2 leading-relaxed">
            Success rate with{' '}
            <Text className="text-primary-500">reward-based habits</Text> for
            your profile type.
          </Text>
        </Animated.View>

        {/* Growth Chart */}
        <Animated.View style={chartStyle}>
          <GrowthBarChart percentGain={profile.trajectoryGain} />
        </Animated.View>
      </ScrollView>

      {/* Footer */}
      <View
        className="absolute bottom-0 left-0 right-0 px-6 pt-4"
        style={{ paddingBottom: Math.max(insets.bottom, 16) + 8 }}
      >
        {/* Gradient overlay */}
        <View className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background-primary via-background-primary/95 to-transparent pointer-events-none" />
        <View className="relative">
          <Button onPress={handleContinue}>
            See My Plan
          </Button>
        </View>
      </View>
    </View>
  );
}
