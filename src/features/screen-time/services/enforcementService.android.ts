import type { ShieldConfig, ShieldActions } from '../types/screenTime.types';

/**
 * Android stub for Screen Time enforcement.
 *
 * TODO: Implement using:
 * - UsageStatsManager for usage tracking
 * - AccessibilityService for app blocking
 * - System overlay for shield UI
 *
 * Note: Android implementation requires different approach:
 * - No native "Family Controls" equivalent
 * - Requires accessibility permission (user must enable in Settings)
 * - App blocking via overlay service
 */
class ScreenTimeEnforcementServiceAndroid {
  async requestAuthorization(): Promise<boolean> {
    console.warn('[EnforcementService] Android: Screen Time not implemented');
    // TODO: Open system settings for usage access permission
    // Linking.openSettings()
    return false;
  }

  async isAuthorized(): Promise<boolean> {
    // TODO: Check UsageStatsManager permission
    return false;
  }

  async blockApps(_selectionId: string): Promise<void> {
    console.warn('[EnforcementService] Android: blockApps not implemented');
    // TODO: Implement using AccessibilityService overlay
  }

  async unblockApps(_selectionId: string, _durationMinutes: number): Promise<void> {
    console.warn('[EnforcementService] Android: unblockApps not implemented');
    // TODO: Remove overlay and start usage monitoring
  }

  async stopMonitoring(): Promise<void> {
    console.warn('[EnforcementService] Android: stopMonitoring not implemented');
  }

  async updateShieldForGoalIncomplete(
    _currentDistance: number,
    _targetDistance: number,
    _unit: 'km' | 'miles'
  ): Promise<void> {
    console.warn('[EnforcementService] Android: updateShieldForGoalIncomplete not implemented');
  }

  async updateShieldForTimeExhausted(
    _usedMinutes: number,
    _distanceToUnlock: number,
    _minutesToEarn: number,
    _unit: 'km' | 'miles',
    _bypassesLeft: number
  ): Promise<void> {
    console.warn('[EnforcementService] Android: updateShieldForTimeExhausted not implemented');
  }

  async updateShield(_config: ShieldConfig, _actions?: ShieldActions): Promise<void> {
    console.warn('[EnforcementService] Android: updateShield not implemented');
  }

  onDeviceActivityEvent(
    _callback: (event: { callbackName: string; eventName: string }) => void
  ): () => void {
    console.warn('[EnforcementService] Android: onDeviceActivityEvent not implemented');
    return () => {};
  }
}

export const enforcementServiceAndroid = new ScreenTimeEnforcementServiceAndroid();
