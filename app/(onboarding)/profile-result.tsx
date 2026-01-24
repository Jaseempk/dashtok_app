import { View, Text, ScrollView } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { useEffect } from "react";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "@/components/ui";
import { useOnboardingStore } from "@/features/onboarding/store/onboardingStore";
import {
  OnboardingHeader,
  ProfileBadge,
  GrowthBarChart,
} from "@/features/onboarding/components";

const PROFILE_TITLES: Record<string, { title: string; subtitle: string }> = {
  rebuilder: { title: "The Momentum", subtitle: "Rebuilder" },
  starter: { title: "The Fresh", subtitle: "Starter" },
  optimizer: { title: "The Active", subtitle: "Optimizer" },
  guardian: { title: "The Digital", subtitle: "Guardian" },
};

export default function ProfileResultScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { goalRecommendation } = useOnboardingStore();

  // Fallback if no recommendation (shouldn't happen in normal flow)
  const profileType = goalRecommendation?.profileType ?? "starter";
  const profileTitles = PROFILE_TITLES[profileType] ?? PROFILE_TITLES.starter;
  const insight =
    goalRecommendation?.profileInsight ?? "Your personalized plan is ready.";
  const successProbability = goalRecommendation?.successProbability ?? 85;
  const projectedGain = goalRecommendation?.projectedGain ?? "+120% in 30 days";

  // Parse projected gain for chart (extract percentage string like "+120%")
  const gainMatch = projectedGain.match(/(\+?\d+%)/);
  const gainPercentString = gainMatch ? gainMatch[1]! : "+120%";

  // Animation values
  const badgeOpacity = useSharedValue(0);
  const profileOpacity = useSharedValue(0);
  const titleOpacity = useSharedValue(0);
  const titleTranslateY = useSharedValue(15);
  const insightOpacity = useSharedValue(0);
  const successOpacity = useSharedValue(0);
  const chartOpacity = useSharedValue(0);

  useEffect(() => {
    // Staggered entrance animations
    badgeOpacity.value = withTiming(1, { duration: 400 });
    profileOpacity.value = withDelay(200, withTiming(1, { duration: 400 }));

    titleOpacity.value = withDelay(
      400,
      withTiming(1, { duration: 400, easing: Easing.out(Easing.cubic) }),
    );
    titleTranslateY.value = withDelay(
      400,
      withTiming(0, { duration: 400, easing: Easing.out(Easing.cubic) }),
    );

    insightOpacity.value = withDelay(600, withTiming(1, { duration: 400 }));
    successOpacity.value = withDelay(800, withTiming(1, { duration: 400 }));
    chartOpacity.value = withDelay(1000, withTiming(1, { duration: 400 }));
  }, []);

  const badgeStyle = useAnimatedStyle(() => ({
    opacity: badgeOpacity.value,
  }));

  const profileStyle = useAnimatedStyle(() => ({
    opacity: profileOpacity.value,
  }));

  const titleStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ translateY: titleTranslateY.value }],
  }));

  const insightStyle = useAnimatedStyle(() => ({
    opacity: insightOpacity.value,
  }));

  const successStyle = useAnimatedStyle(() => ({
    opacity: successOpacity.value,
  }));

  const chartStyle = useAnimatedStyle(() => ({
    opacity: chartOpacity.value,
  }));

  const handleContinue = () => {
    router.push("/(onboarding)/goal-recommendation");
  };

  return (
    <View
      className="flex-1 bg-background-primary"
      style={{ paddingTop: insets.top }}
    >
      <OnboardingHeader showBack={false} />

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
          <Animated.View style={profileStyle}>
            <ProfileBadge size={110} />
          </Animated.View>

          {/* Profile Title */}
          <Animated.View style={titleStyle} className="items-center mt-6 mb-6">
            <Text className="text-3xl font-medium text-white tracking-tight">
              {profileTitles?.title}
            </Text>
            <Text className="text-4xl font-normal text-primary-500 italic">
              {profileTitles?.subtitle}
            </Text>
          </Animated.View>

          {/* Insight Card */}
          <Animated.View
            style={insightStyle}
            className="w-full rounded-2xl bg-background-secondary/60 border border-border-subtle p-5"
          >
            <Text className="text-sm text-gray-300 leading-relaxed text-center">
              {insight}
            </Text>
          </Animated.View>
        </View>

        {/* Success Rate Card */}
        <Animated.View
          style={successStyle}
          className="rounded-2xl bg-background-secondary/60 border border-border-subtle p-5 mb-8"
        >
          <Text className="text-5xl font-bold" style={{ color: "#00f5d4" }}>
            {successProbability}%
          </Text>
          <Text className="text-xs text-gray-400 mt-2 leading-relaxed">
            Success rate with{" "}
            <Text className="text-primary-500">reward-based habits</Text> for
            your profile type.
          </Text>
        </Animated.View>

        {/* Growth Chart */}
        <Animated.View style={chartStyle}>
          <GrowthBarChart percentGain={gainPercentString} />
        </Animated.View>
      </ScrollView>

      {/* Footer */}
      <View
        className="absolute bottom-0 left-0 right-0 px-6 pt-4"
        style={{ paddingBottom: Math.max(insets.bottom, 16) + 8 }}
      >
        <View className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background-primary via-background-primary/95 to-transparent pointer-events-none" />
        <View className="relative">
          <Button onPress={handleContinue}>See My Goal</Button>
        </View>
      </View>
    </View>
  );
}
