import { View, Text, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Icon, Button } from '@/components/ui';
import {
  useTodayAllowance,
  useAllowanceHistory,
  WeeklyChart,
  AllowanceHistoryItem,
} from '@/features/allowances';
import {
  useEnforcementStatus,
  useEnforcementState,
  useBlockedApps,
  useRequestUnlock,
  BalanceCard,
  AllowanceBreakdown,
  EnforcementStatusCard,
  EmergencyBypassButton,
  TimeWarningBanner,
} from '@/features/screen-time';

export default function ScreenTimeModal() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // Data fetching
  const { data: todayAllowance, isLoading: isLoadingAllowance } = useTodayAllowance();
  const { data: enforcementStatus, isLoading: isLoadingEnforcement } = useEnforcementStatus();
  const { data: blockedApps } = useBlockedApps();
  const { data: history, isLoading: isLoadingHistory } = useAllowanceHistory({ limit: 7 });

  // Enforcement state (drives iOS blocking + warning state)
  const { isWarning, remainingFormatted, remainingMinutes } = useEnforcementState();

  // Mutations
  const requestUnlock = useRequestUnlock();

  const handleClose = () => {
    router.back();
  };

  const handleManageApps = () => {
    router.push('/(app)/manage-blocked-apps');
  };

  const handleUnlock = () => {
    requestUnlock.mutate();
  };

  const isLoading = isLoadingAllowance || isLoadingEnforcement;
  const hasBlockedApps = blockedApps && blockedApps.appCount > 0;
  const canUnlock = enforcementStatus?.isUnlocked === false &&
    enforcementStatus?.reason === 'goal_incomplete' &&
    (enforcementStatus?.nextUnlockRequirement?.percentComplete ?? 0) >= 100;

  if (isLoading) {
    return (
      <View className="flex-1 bg-background-primary items-center justify-center">
        <ActivityIndicator size="large" color="#00f5d4" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background-primary" style={{ paddingTop: insets.top }}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-4 border-b border-border-subtle">
        <Pressable onPress={handleClose} className="w-10 h-10 items-center justify-center">
          <Icon name="close" size="lg" color="#9ca3af" />
        </Pressable>
        <Text className="text-lg font-semibold text-white">Screen Time</Text>
        <Pressable onPress={handleManageApps} className="w-10 h-10 items-center justify-center">
          <Icon name="settings" size="lg" color="#9ca3af" />
        </Pressable>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 32 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Balance Card */}
        <View className="mb-4">
          <BalanceCard
            status={enforcementStatus}
            isLoading={isLoadingEnforcement}
          />
        </View>

        {/* 5-Minute Warning Banner */}
        {isWarning && hasBlockedApps && (
          <TimeWarningBanner
            remainingMinutes={remainingMinutes}
            remainingFormatted={remainingFormatted}
          />
        )}

        {/* Allowance Breakdown */}
        {todayAllowance && (
          <View className="mb-4">
            <AllowanceBreakdown
              status={enforcementStatus}
              earnedMinutes={todayAllowance.earnedMinutes}
              bonusMinutes={todayAllowance.bonusMinutes}
            />
          </View>
        )}

        {/* Enforcement Status Card */}
        {hasBlockedApps && (
          <View className="mb-4">
            <EnforcementStatusCard
              status={enforcementStatus}
              isLoading={isLoadingEnforcement}
            />
          </View>
        )}

        {/* Unlock Button - Show when goal is complete but apps still locked */}
        {canUnlock && (
          <View className="mb-4">
            <Button
              onPress={handleUnlock}
              isLoading={requestUnlock.isPending}
            >
              Unlock Apps
            </Button>
          </View>
        )}

        {/* Emergency Bypass - Show when locked */}
        {enforcementStatus?.shouldBlock && hasBlockedApps && (
          <View className="mb-4">
            <EmergencyBypassButton
              bypassesLeft={enforcementStatus.emergencyBypassesLeft}
              isAvailable={enforcementStatus.emergencyBypassAvailable}
            />
          </View>
        )}

        {/* No Blocked Apps Setup */}
        {!hasBlockedApps && (
          <View className="mb-4 p-4 rounded-xl bg-background-secondary border border-border-subtle">
            <View className="flex-row items-center gap-3 mb-3">
              <View className="w-10 h-10 rounded-full bg-primary-500/10 items-center justify-center">
                <Icon name="unlock" size="md" color="#00f5d4" />
              </View>
              <View className="flex-1">
                <Text className="text-base font-semibold text-white">
                  Set Up App Blocking
                </Text>
                <Text className="text-sm text-gray-400">
                  Choose apps to lock until you complete your goals
                </Text>
              </View>
            </View>
            <Button variant="secondary" onPress={handleManageApps}>
              Choose Apps
            </Button>
          </View>
        )}

        {/* Weekly Chart */}
        {!isLoadingHistory && history && history.length > 0 && (
          <View className="mb-4">
            <Text className="text-sm font-medium text-gray-400 mb-3">Weekly Overview</Text>
            <WeeklyChart history={history} />
          </View>
        )}

        {/* History List */}
        {!isLoadingHistory && history && history.length > 0 && (
          <View className="bg-background-secondary rounded-xl p-4">
            <Text className="text-sm font-medium text-gray-400 mb-2">History</Text>
            {history.slice(0, 5).map((allowance) => (
              <AllowanceHistoryItem key={allowance.id} allowance={allowance} />
            ))}
          </View>
        )}

        {/* Empty State - No allowance */}
        {!isLoadingAllowance && !todayAllowance && (
          <View className="items-center py-12">
            <View className="w-16 h-16 rounded-full bg-gray-500/10 items-center justify-center mb-4">
              <Icon name="time" size="2xl" color="#6b7280" />
            </View>
            <Text className="text-lg font-medium text-white mb-2">No Screen Time Yet</Text>
            <Text className="text-sm text-gray-400 text-center max-w-[280px]">
              Complete your daily fitness goal to earn screen time for your favorite apps.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
