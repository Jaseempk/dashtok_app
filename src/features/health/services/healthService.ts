import { Platform } from 'react-native';
import type {
  HealthService,
  HealthPermissionResult,
  HealthActivity,
} from '../types/health.types';

// Platform-specific service selection
function getPlatformService(): HealthService | null {
  try {
    if (Platform.OS === 'ios') {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { healthKitService } = require('./healthkit.ios');
      return healthKitService;
    } else if (Platform.OS === 'android') {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { healthConnectService } = require('./healthconnect.android');
      return healthConnectService;
    }
  } catch (error) {
    console.error('[HealthService] Failed to load platform service:', error);
  }

  return null;
}

const platformService = getPlatformService();

/**
 * Platform-agnostic health service
 * Automatically uses HealthKit on iOS and Health Connect on Android
 */
export const healthService = {
  async isAvailable(): Promise<boolean> {
    if (!platformService) return false;
    return platformService.isAvailable();
  },

  async checkPermissions(): Promise<HealthPermissionResult> {
    if (!platformService) {
      return {
        status: 'unavailable',
        permissions: { steps: false, distance: false, workouts: false },
      };
    }
    return platformService.checkPermissions();
  },

  async requestPermissions(): Promise<HealthPermissionResult> {
    if (!platformService) {
      return {
        status: 'unavailable',
        permissions: { steps: false, distance: false, workouts: false },
      };
    }
    return platformService.requestPermissions();
  },

  async getActivities(startDate: Date, endDate: Date): Promise<HealthActivity[]> {
    if (!platformService) return [];
    return platformService.getActivities(startDate, endDate);
  },

  /**
   * Get activities from the last N days
   */
  async getRecentActivities(days: number = 7): Promise<HealthActivity[]> {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    return this.getActivities(startDate, endDate);
  },

  /**
   * Get today's activities
   */
  async getTodayActivities(): Promise<HealthActivity[]> {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    return this.getActivities(startOfDay, now);
  },
};
