import type { ActivityType } from '@/features/activities/types/activity.types';
import type { HealthBaseline } from '@/features/onboarding/types/onboarding.types';

export type HealthPermissionStatus = 'granted' | 'denied' | 'not_determined' | 'unavailable';

export interface HealthPermissionResult {
  status: HealthPermissionStatus;
  permissions: {
    steps: boolean;
    distance: boolean;
    workouts: boolean;
  };
}

export interface HealthActivity {
  id: string; // Unique ID from health store (healthkitId)
  activityType: ActivityType;
  distanceMeters: number;
  durationSeconds: number;
  steps?: number;
  calories?: number;
  startedAt: Date;
  endedAt: Date;

  // Anti-cheat: source metadata
  sourceBundleId?: string | null;
  sourceDeviceModel?: string | null;
  isManualEntry?: boolean;
  routePointCount?: number;
}

export interface HealthService {
  /**
   * Check if health data is available on this device
   */
  isAvailable(): Promise<boolean>;

  /**
   * Check current permission status
   */
  checkPermissions(): Promise<HealthPermissionResult>;

  /**
   * Request health data permissions
   */
  requestPermissions(): Promise<HealthPermissionResult>;

  /**
   * Get activities from health store within date range
   */
  getActivities(startDate: Date, endDate: Date): Promise<HealthActivity[]>;

  /**
   * Get health baseline for onboarding (optional, 90 days default)
   */
  getBaseline?(days?: number): Promise<HealthBaseline | null>;
}

export interface SyncResult {
  synced: number;
  skipped: number;
  failed: number;
}
