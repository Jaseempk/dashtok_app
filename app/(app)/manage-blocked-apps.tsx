import { useState, useCallback } from 'react';
import { View, Text, Pressable, Alert, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, Icon } from '@/components/ui';
import {
  AppSelectionView,
  useBlockedApps,
  useCreateBlockedApps,
  useCancelPendingChanges,
} from '@/features/screen-time';

export default function ManageBlockedAppsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const { data: blockedApps, isLoading } = useBlockedApps();
  const createBlockedApps = useCreateBlockedApps();
  const cancelPending = useCancelPendingChanges();

  const [pendingSelection, setPendingSelection] = useState<{
    selection: string | null;
    appCount: number;
    categoryCount: number;
  } | null>(null);

  const handleSelectionChange = useCallback(
    (selection: string | null, appCount: number, categoryCount: number) => {
      setPendingSelection({ selection, appCount, categoryCount });
    },
    []
  );

  const handleSave = useCallback(async () => {
    if (!pendingSelection?.selection) return;

    try {
      await createBlockedApps.mutateAsync({
        selectionData: pendingSelection.selection,
        selectionId: `selection_${Date.now()}`,
        appCount: pendingSelection.appCount,
        categoryCount: pendingSelection.categoryCount,
      });

      router.back();
    } catch (error) {
      console.error('[ManageBlockedApps] Save error:', error);
      Alert.alert('Error', 'Failed to save changes. Please try again.');
    }
  }, [pendingSelection, createBlockedApps, router]);

  const handleCancelPending = useCallback(() => {
    Alert.alert(
      'Cancel Pending Changes',
      'This will cancel your scheduled changes and keep your current blocked apps.',
      [
        { text: 'Keep Changes', style: 'cancel' },
        {
          text: 'Cancel Changes',
          style: 'destructive',
          onPress: () => {
            cancelPending.mutate(undefined, {
              onSuccess: () => {
                Alert.alert('Cancelled', 'Pending changes have been cancelled.');
              },
              onError: () => {
                Alert.alert('Error', 'Failed to cancel changes. Please try again.');
              },
            });
          },
        },
      ]
    );
  }, [cancelPending]);

  const handleError = useCallback((error: Error) => {
    console.error('[ManageBlockedApps] Selection error:', error);
    Alert.alert('Error', 'The app picker encountered an error.');
  }, []);

  const formatPendingTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const hasChanges = pendingSelection !== null;
  const isRemoving = hasChanges && (pendingSelection?.appCount ?? 0) < (blockedApps?.appCount ?? 0);

  if (Platform.OS !== 'ios') {
    return (
      <View className="flex-1 bg-background-primary items-center justify-center px-6">
        <Icon name="logo-apple" size="3xl" color="#6b7280" />
        <Text className="text-lg font-semibold text-white mt-4 mb-2">iOS Only</Text>
        <Text className="text-sm text-gray-400 text-center">
          App blocking is only available on iOS devices using Screen Time.
        </Text>
        <Button variant="secondary" onPress={() => router.back()} className="mt-6">
          Go Back
        </Button>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background-primary" style={{ paddingTop: insets.top }}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-4 border-b border-border-subtle">
        <Pressable
          onPress={() => router.back()}
          className="w-10 h-10 items-center justify-center"
        >
          <Icon name="close" size="lg" color="#9ca3af" />
        </Pressable>
        <Text className="text-lg font-semibold text-white">Manage Blocked Apps</Text>
        <View className="w-10" />
      </View>

      {/* Pending Changes Banner */}
      {blockedApps?.hasPendingChanges && blockedApps.pendingAppliesAt && (
        <View className="mx-4 mt-4 p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/30">
          <View className="flex-row items-start gap-3">
            <Icon name="time" size="md" color="#f59e0b" />
            <View className="flex-1">
              <Text className="text-sm font-semibold text-yellow-500 mb-1">
                Pending Changes
              </Text>
              <Text className="text-xs text-gray-400 mb-2">
                {blockedApps.pendingIsActive === false
                  ? 'Enforcement will be disabled'
                  : `Apps will be reduced to ${blockedApps.pendingAppCount}`}
                {' '}on {formatPendingTime(blockedApps.pendingAppliesAt)}
              </Text>
              <Pressable
                onPress={handleCancelPending}
                disabled={cancelPending.isPending}
                className="self-start"
              >
                <Text className="text-xs font-medium text-yellow-500 underline">
                  {cancelPending.isPending ? 'Cancelling...' : 'Cancel these changes'}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      )}

      {/* Current Status */}
      <View className="px-4 py-4">
        <Text className="text-sm text-gray-400">
          Currently blocking {blockedApps?.appCount ?? 0} apps and{' '}
          {blockedApps?.categoryCount ?? 0} categories
        </Text>
      </View>

      {/* App Selection */}
      <View className="flex-1 mx-4 mb-4 rounded-2xl overflow-hidden bg-background-secondary">
        <AppSelectionView
          initialSelection={undefined}
          onSelectionChange={handleSelectionChange}
          onError={handleError}
          style={{ flex: 1 }}
        />
      </View>

      {/* Cooldown Warning */}
      {isRemoving && (
        <View className="mx-4 mb-2 p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
          <Text className="text-xs text-yellow-500 text-center">
            Removing apps will take effect in 24 hours
          </Text>
        </View>
      )}

      {/* Footer */}
      <View
        className="px-4 pt-4 border-t border-border-subtle"
        style={{ paddingBottom: Math.max(insets.bottom, 16) }}
      >
        <Button
          onPress={handleSave}
          isLoading={createBlockedApps.isPending}
          disabled={!hasChanges || blockedApps?.hasPendingChanges}
        >
          {blockedApps?.hasPendingChanges
            ? 'Cancel pending changes first'
            : isRemoving
              ? 'Schedule Changes'
              : 'Save Changes'}
        </Button>
      </View>
    </View>
  );
}
