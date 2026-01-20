import { View, Text, ScrollView, Pressable } from 'react-native';
import Animated from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, Icon } from '@/components/ui';
import { useOnboardingStore } from '@/features/onboarding/store/onboardingStore';
import { PROFILE_CONTENT } from '@/features/onboarding/constants/content';
import { useFadeIn } from '@/lib/animations';

export default function ReportScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { profileType } = useOnboardingStore();

  const profile = PROFILE_CONTENT[profileType ?? 'inconsistent-achiever'];

  // Staggered card animations
  const profileCardStyle = useFadeIn({ duration: 400, translateY: 25 });
  const successCardStyle = useFadeIn({ duration: 400, delay: 150, translateY: 25 });
  const trajectoryCardStyle = useFadeIn({ duration: 400, delay: 300, translateY: 25 });

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
          Your Movement Profile
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
        {/* Profile Card */}
        <Animated.View style={profileCardStyle} className="rounded-2xl bg-background-secondary border border-border-subtle p-6 mb-6">
          {/* Badge */}
          <View className="flex-row items-center gap-2 mb-4">
            <View className="w-2 h-2 rounded-full bg-primary-500" />
            <Text className="text-primary-500 text-xs font-semibold tracking-wider uppercase">
              Report Generated
            </Text>
          </View>

          {/* Profile Icon */}
          <View className="w-20 h-20 rounded-2xl bg-background-tertiary items-center justify-center mb-4">
            <Icon name="sparkles" size="3xl" color="#00f5d4" />
          </View>

          {/* Profile Title */}
          <Text className="text-3xl font-bold text-white leading-tight">
            {profile.title}
          </Text>
          <Text className="text-3xl font-bold text-primary-500 italic mb-4">
            {profile.subtitle}
          </Text>

          {/* Description */}
          <Text className="text-base text-gray-400 leading-relaxed">
            {profile.description}
          </Text>
        </Animated.View>

        {/* Success Rate Card */}
        <Animated.View style={successCardStyle} className="rounded-2xl bg-background-secondary border border-border-subtle p-5 mb-4">
          <Text className="text-xs text-gray-500 tracking-wider uppercase mb-1">
            Success Probability
          </Text>
          <View className="flex-row items-baseline gap-3">
            <Text className="text-4xl font-bold text-primary-500">
              {profile.successRate}%
            </Text>
            <Text className="text-sm text-gray-400 flex-1">
              People with your profile succeed with{' '}
              <Text className="text-primary-500 font-medium">reward-based systems</Text>.
            </Text>
          </View>
        </Animated.View>

        {/* Trajectory Card */}
        <Animated.View style={trajectoryCardStyle} className="rounded-2xl bg-background-secondary border border-border-subtle p-5">
          <Text className="text-xs text-gray-500 tracking-wider uppercase mb-2">
            Projected Trajectory
          </Text>
          <View className="flex-row items-center gap-3 mb-4">
            <Text className="text-2xl font-bold text-white">
              {profile.trajectory}
            </Text>
            <View className="flex-row items-center gap-1.5 px-3 py-1 rounded-full bg-primary-500/20">
              <Icon name="chart" size="sm" color="#00f5d4" />
              <Text className="text-primary-500 text-sm font-semibold">
                {profile.trajectoryGain}
              </Text>
            </View>
          </View>

          {/* Simple chart placeholder */}
          <View className="h-20 rounded-xl bg-background-tertiary items-center justify-center">
            <View className="w-full h-full flex-row items-end justify-around px-4 pb-2">
              <View className="w-1 h-4 rounded-full bg-primary-500/30" />
              <View className="w-1 h-8 rounded-full bg-primary-500/50" />
              <View className="w-1 h-12 rounded-full bg-primary-500/70" />
              <View className="w-1 h-16 rounded-full bg-primary-500" />
            </View>
          </View>
          <View className="flex-row justify-between mt-2 px-2">
            <Text className="text-xs text-gray-500">START</Text>
            <Text className="text-xs text-gray-500">WEEK 4</Text>
            <Text className="text-xs text-gray-500">WEEK 8</Text>
            <Text className="text-xs text-gray-500">GOAL</Text>
          </View>
        </Animated.View>
      </ScrollView>

      {/* Footer */}
      <View
        className="absolute bottom-0 left-0 right-0 px-6 pt-4 bg-background-primary"
        style={{ paddingBottom: Math.max(insets.bottom, 16) + 8 }}
      >
        <Button onPress={handleContinue}>
          See my personalized plan
        </Button>
      </View>
    </View>
  );
}
