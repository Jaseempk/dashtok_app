import { useRef } from "react";
import { View, Text, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Circle, Defs, LinearGradient, Stop } from "react-native-svg";
import * as Haptics from "expo-haptics";
import { Button, Icon } from "@/components/ui";
import {
  OnboardingHeader,
  DistanceSlider,
} from "@/features/onboarding/components";
import { useOnboardingStore } from "@/features/onboarding/store/onboardingStore";

export default function GoalRecommendationScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const lastHapticValue = useRef<number>(0);

  const {
    activityType,
    dailyTargetKm,
    goalRecommendation,
    setDailyTargetKm,
    setUserAdjustedGoal,
  } = useOnboardingStore();

  const suggestedDistance = goalRecommendation?.suggestedDistanceKm ?? 2.0;
  const reasoning =
    goalRecommendation?.reasoning ?? "Based on your profile and fitness level.";

  // Calculate reward minutes
  const rewardRate = activityType === "run" ? 22 : 15;
  const rewardMinutes = Math.round(dailyTargetKm * rewardRate);

  const handleSliderChange = (value: number) => {
    // Haptic on step change
    if (Math.abs(value - lastHapticValue.current) >= 0.5) {
      Haptics.selectionAsync();
      lastHapticValue.current = value;
    }

    setDailyTargetKm(value);
    setUserAdjustedGoal(Math.abs(value - suggestedDistance) > 0.1);
  };

  const handleContinue = () => {
    router.push("/(onboarding)/app-blocking");
  };

  // Ring constants (decorative, full ring)
  const ringSize = 220;
  const strokeWidth = 12;
  const radius = (ringSize - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = 0; // 100% fill

  return (
    <View
      className="flex-1 bg-background-primary"
      style={{ paddingTop: insets.top }}
    >
      <OnboardingHeader step={6} total={7} />

      <ScrollView
        className="flex-1"
        contentContainerClassName="px-6 pb-32"
        showsVerticalScrollIndicator={false}
      >
        {/* Title */}
        <Text className="text-3xl font-bold text-white text-center mb-2">
          Your personalized{"\n"}daily goal
        </Text>
        <Text className="text-sm text-gray-400 text-center mb-10">
          AI-recommended based on your profile. Adjust if needed.
        </Text>

        {/* Gradient Ring Display */}
        <View className="items-center mb-10">
          <View className="w-64 h-64 items-center justify-center">
            <Svg
              width={ringSize}
              height={ringSize}
              style={{
                position: "absolute",
                transform: [{ rotate: "-90deg" }],
              }}
            >
              <Defs>
                <LinearGradient
                  id="ringGradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="0%"
                >
                  <Stop offset="0%" stopColor="#00f5d4" />
                  <Stop offset="100%" stopColor="#00a3ff" />
                </LinearGradient>
              </Defs>
              {/* Background circle */}
              <Circle
                cx={ringSize / 2}
                cy={ringSize / 2}
                r={radius}
                stroke="#1e293b"
                strokeWidth={strokeWidth}
                fill="none"
                opacity={0.5}
              />
              {/* Gradient progress circle */}
              <Circle
                cx={ringSize / 2}
                cy={ringSize / 2}
                r={radius}
                stroke="url(#ringGradient)"
                strokeWidth={strokeWidth}
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
              />
            </Svg>
            {/* Center value */}
            <View className="items-center">
              <Text className="text-6xl font-bold text-white">
                {dailyTargetKm}
              </Text>
              <Text className="text-gray-400 font-light tracking-wide">
                km/day
              </Text>
            </View>
          </View>
        </View>

        {/* AI Recommendation Card */}
        <View className="rounded-2xl bg-background-secondary/60 border border-white/10 p-5 mb-6">
          <View className="flex-row items-start gap-4">
            <View className="w-10 h-10 rounded-xl bg-primary-500/20 items-center justify-center">
              <Icon name="sparkles" size="md" color="#00f5d4" />
            </View>
            <View className="flex-1">
              <Text className="text-[10px] text-primary-500/80 uppercase tracking-widest mb-1">
                AI Recommendation
              </Text>
              <Text className="text-xs text-gray-300 leading-relaxed">
                {reasoning}
              </Text>
            </View>
          </View>
        </View>

        {/* Slider */}
        <View className="mb-6">
          <DistanceSlider
            value={dailyTargetKm}
            min={0.5}
            max={10}
            step={0.5}
            unit="km"
            onChange={handleSliderChange}
          />
        </View>

        {/* Daily Reward Card */}
        <View className="rounded-2xl bg-background-secondary/60 border border-white/10 p-5">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">
                Daily Reward
              </Text>
              <Text className="text-2xl font-bold text-white">
                {rewardMinutes} min
              </Text>
              <Text className="text-xs text-gray-500">
                of screen time unlocked
              </Text>
            </View>
            <View className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/30 items-center justify-center">
              <Icon name="phone" size="xl" color="#ffbf00" />
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Footer */}
      <View
        className="absolute bottom-0 left-0 right-0 px-6 pt-4"
        style={{ paddingBottom: Math.max(insets.bottom, 16) + 8 }}
      >
        <View className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background-primary via-background-primary/95 to-transparent pointer-events-none" />
        <View className="relative">
          <Button onPress={handleContinue}>Continue</Button>
        </View>
      </View>
    </View>
  );
}
