import { View, Text, ScrollView, Alert, ActionSheetIOS, Platform, Modal, TextInput, Pressable, KeyboardAvoidingView, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useState, useCallback, useEffect } from 'react';

import { useAuth } from '@/features/auth';
import { useProfile, useUpdateProfile, useDeleteAccount } from '@/features/user';
import { useUserStore } from '@/stores/userStore';
import { useOnboardingStore } from '@/features/onboarding/store/onboardingStore';
import { useHealthPermissions, useHealthSync } from '@/features/health';
import {
  useNotificationPermission,
  useNotificationSettings,
  notificationService,
} from '@/features/notifications';
import {
  SettingsSection,
  SettingsRow,
  SettingsToggleRow,
  Avatar,
} from '@/components/settings';
import { ConfirmDialog } from '@/components/feedback';
import { colors } from '@/styles/tokens';

export default function ProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { signOut, userEmail, userName } = useAuth();
  const { data: profile } = useProfile();
  const updateProfile = useUpdateProfile();
  const deleteAccount = useDeleteAccount();

  // Local preferences from Zustand store
  const preferences = useUserStore((state) => state.preferences);
  const notifications = useUserStore((state) => state.notifications);
  const setPreference = useUserStore((state) => state.setPreference);
  const setNotification = useUserStore((state) => state.setNotification);
  const resetStore = useUserStore((state) => state.reset);

  // Health data
  const healthConnected = useOnboardingStore((state) => state.healthConnected);
  const setHealthConnected = useOnboardingStore((state) => state.setHealthConnected);
  const { status: healthPermissionStatus, request: requestHealthPermissions, isAvailable: isHealthAvailable } = useHealthPermissions();
  const { sync: syncHealth, isSyncing, lastSyncedAt } = useHealthSync();

  // Notifications
  const {
    status: notificationPermissionStatus,
    requestPermission: requestNotificationPermission,
    isLoading: isRequestingNotification,
  } = useNotificationPermission();
  const {
    preferences: notificationPrefs,
    updatePreference: updateNotificationPref,
    syncFromServer,
    isUpdating: isUpdatingNotifications,
  } = useNotificationSettings();

  // Sync notification preferences from server when profile loads
  useEffect(() => {
    if (profile) {
      syncFromServer(profile as any);
    }
  }, [profile, syncFromServer]);

  // Dialog states
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [editName, setEditName] = useState('');
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const displayName = profile?.name ?? userName ?? 'User';
  const displayEmail = profile?.email ?? userEmail ?? '';

  const handleEditProfile = useCallback(() => {
    setEditName(displayName);
    setShowEditProfile(true);
  }, [displayName]);

  const handleSaveProfile = useCallback(async () => {
    const trimmedName = editName.trim();
    if (!trimmedName) {
      Alert.alert('Error', 'Name cannot be empty');
      return;
    }
    try {
      await updateProfile.mutateAsync({ name: trimmedName });
      setShowEditProfile(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    }
  }, [editName, updateProfile]);

  const handleUnitsPress = useCallback(() => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Cancel', 'Metric (km)', 'Imperial (miles)'],
          cancelButtonIndex: 0,
        },
        (buttonIndex) => {
          if (buttonIndex === 1) setPreference('units', 'km');
          if (buttonIndex === 2) setPreference('units', 'miles');
        }
      );
    } else {
      // For Android, use Alert with buttons
      Alert.alert('Select Units', undefined, [
        { text: 'Metric (km)', onPress: () => setPreference('units', 'km') },
        { text: 'Imperial (miles)', onPress: () => setPreference('units', 'miles') },
        { text: 'Cancel', style: 'cancel' },
      ]);
    }
  }, [setPreference]);

  const handleThemePress = useCallback(() => {
    // Theme is dark-only for now per execution plan
    Alert.alert('App Theme', 'Dark theme is currently the only option. More themes coming soon!');
  }, []);

  const handleExportData = useCallback(() => {
    Alert.alert('Export Data', 'Data export feature coming soon!');
  }, []);

  const handleHealthToggle = useCallback(async (value: boolean) => {
    if (value) {
      // Connect health
      if (!isHealthAvailable) {
        Alert.alert(
          'Health Data Unavailable',
          Platform.OS === 'ios'
            ? 'Apple Health is not available on this device.'
            : 'Health Connect is not available on this device.'
        );
        return;
      }
      const result = await requestHealthPermissions();
      if (result.status === 'granted') {
        setHealthConnected(true);
        // Sync immediately after connecting
        syncHealth();
      } else {
        // Permission not granted - guide user to iOS Settings
        Alert.alert(
          'Health Access Required',
          Platform.OS === 'ios'
            ? 'To sync your workouts automatically, please enable Health access in iOS Settings:\n\nSettings → Health → Data Access & Devices → Dashtok'
            : 'To sync your workouts automatically, please enable Health Connect access in Settings.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => Linking.openSettings() },
          ]
        );
      }
    } else {
      // Disconnect health - show confirmation first
      Alert.alert(
        'Disable Health Sync?',
        'Automatic syncing of your workouts and steps will stop. You can re-enable it anytime.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Disable',
            style: 'destructive',
            onPress: () => setHealthConnected(false),
          },
        ]
      );
    }
  }, [isHealthAvailable, requestHealthPermissions, setHealthConnected, syncHealth]);

  const handleSyncNow = useCallback(async () => {
    if (!healthConnected) {
      Alert.alert('Not Connected', 'Please connect health data first.');
      return;
    }
    const result = await syncHealth();
    Alert.alert(
      'Sync Complete',
      `Synced ${result.synced} activities, ${result.skipped} already existed.`
    );
  }, [healthConnected, syncHealth]);

  const formatLastSync = () => {
    if (!lastSyncedAt) return 'Never';
    const now = new Date();
    const diff = now.getTime() - lastSyncedAt.getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return lastSyncedAt.toLocaleDateString();
  };

  const handleLogout = useCallback(async () => {
    setIsLoggingOut(true);
    try {
      resetStore();
      await signOut();
      // Navigation will be handled by AuthGuard
    } catch (error) {
      Alert.alert('Error', 'Failed to sign out. Please try again.');
    } finally {
      setIsLoggingOut(false);
      setShowLogoutDialog(false);
    }
  }, [signOut, resetStore]);

  const handleDeleteAccount = useCallback(async () => {
    try {
      await deleteAccount.mutateAsync();
      resetStore();
      await signOut();
      // Navigation will be handled by AuthGuard
    } catch (error) {
      Alert.alert('Error', 'Failed to delete account. Please try again.');
    }
    setShowDeleteDialog(false);
  }, [deleteAccount, signOut, resetStore]);

  return (
    <View className="flex-1 bg-background-primary" style={{ paddingTop: insets.top }}>
      {/* Header */}
      <View className="px-4 py-4">
        <Text className="text-2xl font-bold text-white text-center">Profile & Settings</Text>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Avatar & User Info */}
        <View className="items-center mb-8">
          <Avatar
            name={displayName}
            size={100}
            onEdit={handleEditProfile}
          />
          <Text className="text-2xl font-bold text-white mt-4">{displayName}</Text>
          <Text className="text-base text-gray-400 mt-1">{displayEmail}</Text>
        </View>

        {/* Preferences Section */}
        <SettingsSection title="Preferences">
          <SettingsRow
            icon="chart"
            iconColor={colors.primary[500]}
            label="Units"
            value={preferences.units === 'km' ? 'Metric' : 'Imperial'}
            onPress={handleUnitsPress}
          />
          <View className="h-px bg-border-subtle mx-4" />
          <SettingsRow
            icon="hourglass"
            iconColor="#a855f7"
            label="App Theme"
            value="Dark"
            onPress={handleThemePress}
          />
        </SettingsSection>

        {/* Notifications Section */}
        <SettingsSection title="Notifications">
          {/* Permission Status */}
          {notificationPermissionStatus !== 'granted' && (
            <>
              <SettingsRow
                icon="bell"
                iconColor="#f59e0b"
                label="Enable Notifications"
                subtitle={
                  notificationPermissionStatus === 'denied'
                    ? 'Tap to open Settings'
                    : 'Get reminders and alerts'
                }
                onPress={async () => {
                  if (notificationPermissionStatus === 'denied') {
                    // Open app settings to enable notifications
                    Linking.openSettings();
                  } else {
                    const granted = await requestNotificationPermission();
                    if (granted) {
                      Alert.alert('Notifications Enabled', 'You will now receive reminders and alerts.');
                    }
                  }
                }}
                disabled={isRequestingNotification}
              />
              <View className="h-px bg-border-subtle mx-4" />
            </>
          )}

          {/* Notification Toggles (only show if permission granted) */}
          {notificationPermissionStatus === 'granted' && (
            <>
              <SettingsToggleRow
                icon="notifications"
                iconColor="#f59e0b"
                label="Notifications Enabled"
                value={notificationPrefs.notificationsEnabled}
                onValueChange={async (value) => {
                  if (!value) {
                    // Disabling - remove push token from server
                    await notificationService.removeTokenFromServer();
                  }
                  updateNotificationPref('notificationsEnabled', value);
                }}
                disabled={isUpdatingNotifications}
              />
              <View className="h-px bg-border-subtle mx-4" />
            </>
          )}

          <SettingsToggleRow
            icon="sunny"
            iconColor="#f59e0b"
            label="Daily Reminders"
            subtitle="Morning motivation at 8 AM"
            value={notificationPrefs.dailyReminderEnabled}
            onValueChange={(value) => updateNotificationPref('dailyReminderEnabled', value)}
            disabled={isUpdatingNotifications || !notificationPrefs.notificationsEnabled}
          />
          <View className="h-px bg-border-subtle mx-4" />
          <SettingsToggleRow
            icon="flame"
            iconColor={colors.secondary[500]}
            label="Streak Alerts"
            subtitle="Evening reminder if goal not met"
            value={notificationPrefs.streakAlertsEnabled}
            onValueChange={(value) => updateNotificationPref('streakAlertsEnabled', value)}
            disabled={isUpdatingNotifications || !notificationPrefs.notificationsEnabled}
          />
          <View className="h-px bg-border-subtle mx-4" />
          <SettingsToggleRow
            icon="stats-chart"
            iconColor="#8b5cf6"
            label="Weekly Summary"
            subtitle="Sunday progress report"
            value={notificationPrefs.weeklySummaryEnabled}
            onValueChange={(value) => updateNotificationPref('weeklySummaryEnabled', value)}
            disabled={isUpdatingNotifications || !notificationPrefs.notificationsEnabled}
          />
        </SettingsSection>

        {/* Health Data Section */}
        <SettingsSection title="Health Data">
          <SettingsToggleRow
            icon="heart"
            iconColor="#ef4444"
            label={Platform.OS === 'ios' ? 'Apple Health Sync' : 'Health Connect Sync'}
            subtitle={healthConnected ? `Last sync: ${formatLastSync()}` : 'Sync steps and workouts'}
            value={healthConnected}
            onValueChange={handleHealthToggle}
          />
          {healthConnected && (
            <>
              <View className="h-px bg-border-subtle mx-4" />
              <SettingsRow
                icon="cloud"
                iconColor={colors.primary[500]}
                label="Sync Now"
                value={isSyncing ? 'Syncing...' : undefined}
                onPress={handleSyncNow}
                disabled={isSyncing}
              />
            </>
          )}
        </SettingsSection>

        {/* Account Section */}
        <SettingsSection title="Account">
          <SettingsRow
            icon="cloud"
            iconColor="#6b7280"
            label="Export Data"
            onPress={handleExportData}
          />
          <View className="h-px bg-border-subtle mx-4" />
          <SettingsRow
            icon="unlock"
            iconColor="#6b7280"
            label="Log Out"
            onPress={() => setShowLogoutDialog(true)}
            showChevron={false}
          />
          <View className="h-px bg-border-subtle mx-4" />
          <SettingsRow
            icon="trash"
            label="Delete Account"
            onPress={() => setShowDeleteDialog(true)}
            showChevron={false}
            variant="danger"
          />
        </SettingsSection>

        {/* App Version */}
        <Text className="text-xs text-gray-500 text-center mt-4">
          Dashtok v1.0.0
        </Text>
      </ScrollView>

      {/* Logout Confirmation Dialog */}
      <ConfirmDialog
        visible={showLogoutDialog}
        title="Log Out"
        message="Are you sure you want to log out? You'll need to sign in again to access your account."
        confirmLabel="Log Out"
        cancelLabel="Cancel"
        onConfirm={handleLogout}
        onCancel={() => setShowLogoutDialog(false)}
        isLoading={isLoggingOut}
      />

      {/* Delete Account Confirmation Dialog */}
      <ConfirmDialog
        visible={showDeleteDialog}
        title="Delete Account"
        message="This action cannot be undone. All your data including activities, goals, and progress will be permanently deleted."
        confirmLabel="Delete Account"
        cancelLabel="Cancel"
        onConfirm={handleDeleteAccount}
        onCancel={() => setShowDeleteDialog(false)}
        destructive
        isLoading={deleteAccount.isPending}
      />

      {/* Edit Profile Modal */}
      <Modal
        visible={showEditProfile}
        transparent
        animationType="fade"
        onRequestClose={() => setShowEditProfile(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          className="flex-1"
        >
          <Pressable
            className="flex-1 bg-black/70 justify-center px-6"
            onPress={() => setShowEditProfile(false)}
          >
            <Pressable className="bg-background-secondary rounded-2xl p-6">
              <Text className="text-xl font-bold text-white text-center mb-4">
                Edit Profile
              </Text>
              <Text className="text-sm text-gray-400 mb-2">Name</Text>
              <TextInput
                value={editName}
                onChangeText={setEditName}
                placeholder="Enter your name"
                placeholderTextColor="#6b7280"
                autoFocus
                className="bg-background-tertiary text-white px-4 py-3 rounded-xl text-base mb-6"
              />
              <View className="gap-3">
                <Pressable
                  onPress={handleSaveProfile}
                  disabled={updateProfile.isPending}
                  className={`py-3 rounded-xl items-center bg-primary-500 ${
                    updateProfile.isPending ? 'opacity-50' : 'active:opacity-80'
                  }`}
                >
                  <Text className="font-semibold text-black">
                    {updateProfile.isPending ? 'Saving...' : 'Save'}
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => setShowEditProfile(false)}
                  disabled={updateProfile.isPending}
                  className="py-3 rounded-xl items-center bg-background-tertiary active:opacity-80"
                >
                  <Text className="font-semibold text-gray-300">Cancel</Text>
                </Pressable>
              </View>
            </Pressable>
          </Pressable>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}
