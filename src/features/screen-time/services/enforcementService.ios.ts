import * as ReactNativeDeviceActivity from 'react-native-device-activity';
import type { ShieldConfig, ShieldActions } from '../types/screenTime.types';

const MONITOR_NAME = 'DashtokDailyMonitor';

// Dashtok brand colors
const COLORS = {
  cyan: { red: 0, green: 245, blue: 212 },
  white: { red: 255, green: 255, blue: 255 },
  gray400: { red: 156, green: 163, blue: 175 },
  slate900: { red: 15, green: 23, blue: 42 },
  black: { red: 0, green: 0, blue: 0 },
};

class ScreenTimeEnforcementServiceIOS {
  /**
   * Request Screen Time authorization from user.
   * Must be called before any other Screen Time operations.
   */
  async requestAuthorization(): Promise<boolean> {
    try {
      await ReactNativeDeviceActivity.requestAuthorization();
      return true;
    } catch (error) {
      console.error('[EnforcementService] Authorization failed:', error);
      return false;
    }
  }

  /**
   * Check if Screen Time is authorized.
   */
  async isAuthorized(): Promise<boolean> {
    try {
      const status = await ReactNativeDeviceActivity.getAuthorizationStatus();
      return status === 'approved';
    } catch (error) {
      console.error('[EnforcementService] Failed to check authorization:', error);
      return false;
    }
  }

  /**
   * Block all selected apps immediately.
   */
  async blockApps(selectionId: string): Promise<void> {
    try {
      await ReactNativeDeviceActivity.blockSelection({
        activitySelectionId: selectionId,
      });
      console.log('[EnforcementService] Apps blocked');
    } catch (error) {
      console.error('[EnforcementService] Failed to block apps:', error);
      throw error;
    }
  }

  /**
   * Unblock apps and start monitoring for time threshold.
   */
  async unblockApps(selectionId: string, durationMinutes: number): Promise<void> {
    try {
      // 1. Remove the block
      await ReactNativeDeviceActivity.unblockSelection({
        activitySelectionId: selectionId,
      });

      // 2. Start monitoring with threshold to re-block when time exhausted
      await ReactNativeDeviceActivity.startMonitoring(
        MONITOR_NAME,
        {
          intervalStart: { hour: 0, minute: 0, second: 0 },
          intervalEnd: { hour: 23, minute: 59, second: 59 },
          repeats: true,
        },
        [
          {
            eventName: `time_exhausted_${durationMinutes}`,
            familyActivitySelectionId: selectionId,
            threshold: { minute: durationMinutes },
            // When threshold reached, automatically re-block
          },
        ]
      );

      console.log(`[EnforcementService] Apps unblocked for ${durationMinutes} minutes`);
    } catch (error) {
      console.error('[EnforcementService] Failed to unblock apps:', error);
      throw error;
    }
  }

  /**
   * Stop monitoring (e.g., when user disables enforcement).
   */
  async stopMonitoring(): Promise<void> {
    try {
      await ReactNativeDeviceActivity.stopMonitoring(MONITOR_NAME);
      console.log('[EnforcementService] Monitoring stopped');
    } catch (error) {
      console.error('[EnforcementService] Failed to stop monitoring:', error);
      throw error;
    }
  }

  /**
   * Update shield appearance for "goal incomplete" state.
   */
  async updateShieldForGoalIncomplete(
    currentDistance: number,
    targetDistance: number,
    unit: 'km' | 'miles'
  ): Promise<void> {
    const remaining = Math.max(0, targetDistance - currentDistance).toFixed(1);

    await this.updateShield({
      title: 'Movement = Minutes',
      subtitle: `Complete ${remaining} ${unit} more to unlock your apps.\n\nCurrent: ${currentDistance.toFixed(1)} / ${targetDistance} ${unit}`,
      titleColor: COLORS.white,
      subtitleColor: COLORS.gray400,
      backgroundColor: COLORS.slate900,
      primaryButtonLabel: 'Go for a walk →',
      primaryButtonBackgroundColor: COLORS.cyan,
      primaryButtonLabelColor: COLORS.black,
      iconSystemName: 'lock.fill',
    });
  }

  /**
   * Update shield appearance for "time exhausted" state.
   */
  async updateShieldForTimeExhausted(
    usedMinutes: number,
    distanceToUnlock: number,
    minutesToEarn: number,
    unit: 'km' | 'miles',
    bypassesLeft: number
  ): Promise<void> {
    const bypassText = bypassesLeft > 0
      ? `\n\nEmergency bypass: ${bypassesLeft} use${bypassesLeft !== 1 ? 's' : ''} left today`
      : '';

    await this.updateShield({
      title: "Time's up!",
      subtitle: `You've used your ${usedMinutes} minutes of earned screen time.\n\nWalk ${distanceToUnlock.toFixed(1)} ${unit} to unlock ${minutesToEarn} more minutes.${bypassText}`,
      titleColor: COLORS.white,
      subtitleColor: COLORS.gray400,
      backgroundColor: COLORS.slate900,
      primaryButtonLabel: 'Earn more time now',
      primaryButtonBackgroundColor: COLORS.cyan,
      primaryButtonLabelColor: COLORS.black,
      secondaryButtonLabel: 'Close app',
      secondaryButtonLabelColor: COLORS.gray400,
      iconSystemName: 'flame.fill',
    });
  }

  /**
   * Update shield with custom configuration.
   */
  async updateShield(config: ShieldConfig, actions?: ShieldActions): Promise<void> {
    try {
      await ReactNativeDeviceActivity.updateShield(
        {
          title: config.title,
          subtitle: config.subtitle,
          titleColor: config.titleColor,
          subtitleColor: config.subtitleColor,
          backgroundColor: config.backgroundColor,
          primaryButtonLabel: config.primaryButtonLabel,
          primaryButtonBackgroundColor: config.primaryButtonBackgroundColor,
          primaryButtonLabelColor: config.primaryButtonLabelColor,
          secondaryButtonLabel: config.secondaryButtonLabel,
          secondaryButtonLabelColor: config.secondaryButtonLabelColor,
          // backgroundBlurStyle: UIBlurEffectStyle.systemMaterialDark,
        },
        actions ?? {
          primary: { type: 'close', behavior: 'close' },
          secondary: { type: 'dismiss', behavior: 'defer' },
        }
      );
      console.log('[EnforcementService] Shield updated');
    } catch (error) {
      console.error('[EnforcementService] Failed to update shield:', error);
      throw error;
    }
  }

  /**
   * Listen for device activity events (threshold reached, etc.).
   */
  onDeviceActivityEvent(
    callback: (event: { callbackName: string; eventName: string }) => void
  ): () => void {
    const subscription = ReactNativeDeviceActivity.onDeviceActivityMonitorEvent(
      (event) => {
        callback({
          callbackName: event.nativeEvent.callbackName,
          eventName: event.nativeEvent.eventName ?? '',
        });
      }
    );

    return () => {
      subscription.remove();
    };
  }
}

export const enforcementServiceIOS = new ScreenTimeEnforcementServiceIOS();
