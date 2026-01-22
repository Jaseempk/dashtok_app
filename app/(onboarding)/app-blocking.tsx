import { useState, useCallback } from 'react';
import { View, Text, Pressable, Alert, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, Icon } from '@/components/ui';
import { PermissionRow } from '@/features/onboarding/components';
import { useOnboardingStore } from '@/features/onboarding/store/onboardingStore';
import { AppSelectionView, enforcementService, useCreateBlockedApps } from '@/features/screen-time';

const APP_BLOCKING_PERMISSIONS = [
  {
    icon: 'lock-closed' as const,
    title: 'Block Distracting Apps',
    description: 'Lock apps until you complete your fitness goal',
  },
  {
    icon: 'time' as const,
    title: 'Track Screen Time',
    description: 'Monitor how long you use selected apps',
  },
  {
    icon: 'shield-checkmark' as const,
    title: 'Earn Access',
    description: 'Unlock apps by completing your daily movement',
  },
];

type Step = 'permission' | 'selection';

export default function AppBlockingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const {
    setScreenTimeAuthorized,
    setBlockedAppsSelection,
    blockedAppsSelection,
  } = useOnboardingStore();
  const createBlockedApps = useCreateBlockedApps();

  const [step, setStep] = useState<Step>('permission');
  const [isAuthorizing, setIsAuthorizing] = useState(false);
  const [pendingSelection, setPendingSelection] = useState<{
    selection: string | null;
    appCount: number;
    categoryCount: number;
  } | null>(null);

  // Request Screen Time authorization
  const handleRequestPermission = useCallback(async () => {
    if (Platform.OS !== 'ios') {
      // Android doesn't have Screen Time API
      Alert.alert(
        'iOS Only',
        'App blocking is currently only available on iOS. You can skip this step.',
        [{ text: 'OK', onPress: handleSkip }]
      );
      return;
    }

    setIsAuthorizing(true);
    try {
      const authorized = await enforcementService.requestAuthorization();

      if (authorized) {
        setScreenTimeAuthorized(true);
        setStep('selection');
      } else {
        Alert.alert(
          'Permission Required',
          'Screen Time access is needed to block distracting apps. You can enable this later in Settings.',
          [
            { text: 'Skip for Now', onPress: handleSkip },
            { text: 'Try Again', onPress: handleRequestPermission },
          ]
        );
      }
    } catch (error) {
      console.error('[AppBlocking] Authorization error:', error);
      Alert.alert(
        'Authorization Failed',
        'Unable to request Screen Time permission. You can try again later.',
        [
          { text: 'Skip for Now', onPress: handleSkip },
          { text: 'Cancel', style: 'cancel' },
        ]
      );
    } finally {
      setIsAuthorizing(false);
    }
  }, [setScreenTimeAuthorized]);

  // Handle app selection change
  const handleSelectionChange = useCallback(
    (selection: string | null, appCount: number, categoryCount: number) => {
      setPendingSelection({ selection, appCount, categoryCount });
    },
    []
  );

  // Save selection and continue
  const handleContinue = useCallback(async () => {
    if (step === 'permission') {
      await handleRequestPermission();
      return;
    }

    if (!pendingSelection?.selection) {
      // No apps selected, just continue
      router.push('/(onboarding)/notifications');
      return;
    }

    try {
      // Save to local store
      setBlockedAppsSelection(
        pendingSelection.selection,
        pendingSelection.appCount,
        pendingSelection.categoryCount
      );

      // Save to server (will be associated with user after onboarding completes)
      await createBlockedApps.mutateAsync({
        selectionData: pendingSelection.selection,
        selectionId: `selection_${Date.now()}`,
        appCount: pendingSelection.appCount,
        categoryCount: pendingSelection.categoryCount,
      });

      // Block apps immediately
      await enforcementService.blockApps(`selection_${Date.now()}`);

      router.push('/(onboarding)/notifications');
    } catch (error) {
      console.error('[AppBlocking] Save error:', error);
      // Still continue even if save fails - we can retry later
      router.push('/(onboarding)/notifications');
    }
  }, [
    step,
    pendingSelection,
    handleRequestPermission,
    setBlockedAppsSelection,
    createBlockedApps,
    router,
  ]);

  const handleSkip = useCallback(() => {
    router.push('/(onboarding)/notifications');
  }, [router]);

  const handleBack = useCallback(() => {
    if (step === 'selection') {
      setStep('permission');
    } else {
      router.back();
    }
  }, [step, router]);

  const handleError = useCallback((error: Error) => {
    console.error('[AppBlocking] Selection error:', error);
    Alert.alert(
      'Something went wrong',
      'The app picker encountered an error. You can try again or skip this step.',
      [
        { text: 'Skip', onPress: handleSkip },
        { text: 'Try Again', style: 'cancel' },
      ]
    );
  }, [handleSkip]);

  const hasSelection = (pendingSelection?.appCount ?? 0) > 0 || (pendingSelection?.categoryCount ?? 0) > 0;
  const buttonText =
    step === 'permission'
      ? 'Enable Screen Time'
      : hasSelection
        ? `Block ${pendingSelection?.appCount ?? 0} apps`
        : 'Continue';

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
          Step 6 of 7
        </Text>
        <Pressable onPress={handleSkip} disabled={isAuthorizing}>
          <Text
            className={`font-semibold text-sm ${isAuthorizing ? 'text-gray-500' : 'text-primary-500'}`}
          >
            Skip
          </Text>
        </Pressable>
      </View>

      {step === 'permission' ? (
        // Permission Request View
        <View className="flex-1 px-6">
          {/* Hero Icon */}
          <View className="items-center mb-6">
            <View className="w-24 h-24 rounded-3xl bg-primary-500/10 border border-primary-500/30 items-center justify-center">
              <Icon name="lock-closed" size="3xl" color="#00f5d4" />
            </View>
          </View>

          {/* Title */}
          <Text className="text-3xl font-bold text-white text-center mb-2">
            Choose apps{'\n'}to limit
          </Text>
          <Text className="text-base text-gray-400 text-center mb-8">
            Select distracting apps that you want to{'\n'}lock until you hit your fitness goal.
          </Text>

          {/* Permission Rows */}
          <View className="gap-3">
            {APP_BLOCKING_PERMISSIONS.map((permission) => (
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
              <Icon name="shield" size="sm" color="#00f5d4" />
              <Text className="text-sm font-semibold text-white">
                Enforced by iOS
              </Text>
            </View>
            <Text className="text-xs text-gray-400 leading-relaxed">
              App blocking uses Apple's Screen Time API. Once enabled, apps stay
              locked until you complete your goal - you can't cheat!
            </Text>
          </View>

          {/* iOS only note */}
          {Platform.OS !== 'ios' && (
            <View className="mt-4 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
              <Text className="text-xs text-yellow-500 text-center">
                App blocking is only available on iOS devices
              </Text>
            </View>
          )}
        </View>
      ) : (
        // App Selection View
        <View className="flex-1">
          <View className="px-6 mb-4">
            <Text className="text-2xl font-bold text-white mb-1">
              Select apps to block
            </Text>
            <Text className="text-sm text-gray-400">
              These apps will be locked until you complete your daily goal.
            </Text>
          </View>

          {/* Native App Picker */}
          <View className="flex-1 mx-4 mb-4 rounded-2xl overflow-hidden bg-background-secondary">
            <AppSelectionView
              initialSelection={blockedAppsSelection ?? undefined}
              onSelectionChange={handleSelectionChange}
              onError={handleError}
              style={{ flex: 1 }}
            />
          </View>

          {/* Selection Summary */}
          {hasSelection && (
            <View className="mx-6 mb-2 p-3 rounded-xl bg-primary-500/10 border border-primary-500/20">
              <Text className="text-sm text-primary-500 text-center">
                {pendingSelection?.appCount ?? 0} app
                {(pendingSelection?.appCount ?? 0) !== 1 ? 's' : ''} and{' '}
                {pendingSelection?.categoryCount ?? 0} categor
                {(pendingSelection?.categoryCount ?? 0) !== 1 ? 'ies' : 'y'} selected
              </Text>
            </View>
          )}
        </View>
      )}

      {/* Footer */}
      <View
        className="px-6 pt-4 bg-background-primary"
        style={{ paddingBottom: Math.max(insets.bottom, 16) + 8 }}
      >
        <Button
          onPress={handleContinue}
          isLoading={isAuthorizing || createBlockedApps.isPending}
          disabled={step === 'selection' && !hasSelection && !blockedAppsSelection}
        >
          {buttonText}
        </Button>
        {step === 'selection' && !hasSelection && (
          <Pressable onPress={handleSkip} className="mt-3 py-2">
            <Text className="text-gray-400 text-center text-sm">
              I'll set this up later
            </Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}
