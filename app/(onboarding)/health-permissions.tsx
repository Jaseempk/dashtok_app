import { useState } from "react";
import { View, Text, Pressable, Alert, Platform } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button, Icon } from "@/components/ui";
import { PermissionRow } from "@/features/onboarding/components";
import { useOnboardingStore } from "@/features/onboarding/store/onboardingStore";
import { HEALTH_PERMISSIONS } from "@/features/onboarding/constants/content";
import { useHealthPermissions } from "@/features/health";

export default function HealthPermissionsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { setHealthConnected } = useOnboardingStore();
  const { request, isAvailable, isLoading } = useHealthPermissions();
  const [isRequesting, setIsRequesting] = useState(false);

  const handleConnect = async () => {
    setIsRequesting(true);
    try {
      if (!isAvailable) {
        Alert.alert(
          "Health Data Unavailable",
          Platform.OS === "ios"
            ? "Apple Health is not available on this device. You can still log activities manually."
            : "Health Connect is not available on this device. You can still log activities manually.",
          [
            { text: "Continue Anyway", onPress: () => handleSkip() },
            { text: "Cancel", style: "cancel" },
          ],
        );
        return;
      }

      const result = await request();

      if (result.status === "granted") {
        setHealthConnected(true);
        router.push("/(onboarding)/fitness-habits");
      } else if (result.status === "denied") {
        Alert.alert(
          "Permission Denied",
          "Health data access was denied. You can enable it later in Settings, or continue to log activities manually.",
          [
            { text: "Continue Without Health", onPress: () => handleSkip() },
            { text: "Try Again", onPress: () => handleConnect() },
          ],
        );
      } else {
        // unavailable or other status
        handleSkip();
      }
    } catch (error) {
      console.error("[HealthPermissions] Error:", error);
      Alert.alert(
        "Connection Failed",
        "Unable to connect to health data. You can try again later or continue without it.",
        [
          { text: "Continue Without Health", onPress: () => handleSkip() },
          { text: "Cancel", style: "cancel" },
        ],
      );
    } finally {
      setIsRequesting(false);
    }
  };

  const handleSkip = () => {
    router.push("/(onboarding)/fitness-habits");
  };

  const handleBack = () => {
    router.back();
  };

  const buttonLoading = isLoading || isRequesting;

  return (
    <View
      className="flex-1 bg-background-primary"
      style={{ paddingTop: insets.top }}
    >
      {/* Header */}
      <View className="flex-row items-center justify-between px-6 py-4">
        <Pressable
          onPress={handleBack}
          className="w-11 h-11 items-center justify-center rounded-full active:bg-background-secondary"
        >
          <Icon name="arrow-back" size="lg" color="#9ca3af" />
        </Pressable>
        <Text className="text-xs font-semibold text-gray-400 tracking-wider uppercase">
          Step 2 of 7
        </Text>
        <Pressable onPress={handleSkip} disabled={buttonLoading}>
          <Text
            className={`font-semibold text-sm ${buttonLoading ? "text-gray-500" : "text-primary-500"}`}
          >
            Skip
          </Text>
        </Pressable>
      </View>

      <View className="flex-1 px-6">
        {/* Hero Icon */}
        <View className="items-center mb-6">
          <View className="w-24 h-24 rounded-3xl bg-primary-500/10 border border-primary-500/30 items-center justify-center">
            <Icon name="heart" size="3xl" color="#00f5d4" />
          </View>
        </View>

        {/* Title */}
        <Text className="text-3xl font-bold text-white text-center mb-2">
          Connect your{"\n"}Apple health
        </Text>
        <Text className="text-base text-gray-400 text-center mb-8">
          We'll sync your activity to track your{"\n"}progress and unlock
          rewards.
        </Text>

        {/* Permission Rows */}
        <View className="gap-3">
          {HEALTH_PERMISSIONS.map((permission) => (
            <PermissionRow
              key={permission.title}
              icon={permission.icon}
              title={permission.title}
              description={permission.description}
            />
          ))}
        </View>

        {/* Privacy Note */}
        <View className="mt-6 p-4 rounded-xl bg-background-secondary/50">
          <View className="flex-row items-center gap-2 mb-1">
            <Icon name="lock" size="sm" color="#00f5d4" />
            <Text className="text-sm font-semibold text-white">
              Your data stays private
            </Text>
          </View>
          <Text className="text-xs text-gray-400 leading-relaxed">
            We only read what's needed to verify your activity. Your health data
            is never sold or shared with third parties.
          </Text>
        </View>

        {/* Availability note */}
        {!isAvailable && !isLoading && (
          <View className="mt-4 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
            <Text className="text-xs text-yellow-500 text-center">
              {Platform.OS === "ios"
                ? "Apple Health is not available on this device"
                : "Health Connect is not installed on this device"}
            </Text>
          </View>
        )}
      </View>

      {/* Footer */}
      <View
        className="px-6 pt-4 bg-background-primary"
        style={{ paddingBottom: Math.max(insets.bottom, 16) + 8 }}
      >
        <Button onPress={handleConnect} isLoading={buttonLoading}>
          Connect Health Data
        </Button>
      </View>
    </View>
  );
}
