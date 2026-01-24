import {
  isHealthDataAvailable,
  requestAuthorization,
  queryWorkoutSamples,
  queryQuantitySamples,
  getRequestStatusForAuthorization,
  HKQuantityTypeIdentifier,
  HKWorkoutTypeIdentifier,
  HKWorkoutActivityType,
} from '@kingstinct/react-native-healthkit';
import type { HealthBaseline } from '@/features/onboarding/types/onboarding.types';
import type { HKWorkout } from '@kingstinct/react-native-healthkit';
import type {
  HealthService,
  HealthPermissionResult,
  HealthActivity,
} from '../types/health.types';

// Permissions we need to read
const READ_PERMISSIONS = [
  HKQuantityTypeIdentifier.stepCount,
  HKQuantityTypeIdentifier.distanceWalkingRunning,
  HKQuantityTypeIdentifier.activeEnergyBurned,
  HKWorkoutTypeIdentifier,
] as const;

class HealthKitService implements HealthService {
  private authorized = false;

  async isAvailable(): Promise<boolean> {
    try {
      return await isHealthDataAvailable();
    } catch (error) {
      console.error('[HealthKit] isAvailable error:', error);
      return false;
    }
  }

  async checkPermissions(): Promise<HealthPermissionResult> {
    const available = await this.isAvailable();
    if (!available) {
      return {
        status: 'unavailable',
        permissions: { steps: false, distance: false, workouts: false },
      };
    }

    try {
      // v8 API: pass array directly as first argument
      const status = await getRequestStatusForAuthorization([...READ_PERMISSIONS]);

      // Status: 0 = unknown, 1 = shouldRequest, 2 = unnecessary (already granted)
      if (status === 2) {
        this.authorized = true;
        return {
          status: 'granted',
          permissions: { steps: true, distance: true, workouts: true },
        };
      }

      return {
        status: 'not_determined',
        permissions: { steps: false, distance: false, workouts: false },
      };
    } catch (error) {
      console.error('[HealthKit] checkPermissions error:', error);
      return {
        status: 'denied',
        permissions: { steps: false, distance: false, workouts: false },
      };
    }
  }

  async requestPermissions(): Promise<HealthPermissionResult> {
    const available = await this.isAvailable();
    if (!available) {
      return {
        status: 'unavailable',
        permissions: { steps: false, distance: false, workouts: false },
      };
    }

    try {
      // v8 API: pass array directly as first argument
      // Note: requestAuthorization() shows the iOS permission modal (if not already shown)
      // It does NOT throw on denial - it returns silently regardless of user's choice
      await requestAuthorization([...READ_PERMISSIONS]);

      // Check actual permission status after requesting
      // iOS only shows the modal once per app install, so we verify what the user chose
      return this.checkPermissions();
    } catch (error) {
      console.error('[HealthKit] requestPermissions error:', error);
      return {
        status: 'denied',
        permissions: { steps: false, distance: false, workouts: false },
      };
    }
  }

  async getActivities(startDate: Date, endDate: Date): Promise<HealthActivity[]> {
    if (!this.authorized) {
      const permResult = await this.checkPermissions();
      if (permResult.status !== 'granted') {
        console.warn('[HealthKit] Not authorized to read activities');
        return [];
      }
    }

    try {
      const workouts = await this.getWorkouts(startDate, endDate);
      return workouts;
    } catch (error) {
      console.error('[HealthKit] getActivities error:', error);
      return [];
    }
  }

  private async getWorkouts(startDate: Date, endDate: Date): Promise<HealthActivity[]> {
    try {
      // v8 API: returns array directly, not { samples: [...] }
      const workouts = await queryWorkoutSamples({
        from: startDate,
        to: endDate,
        limit: 100,
      });

      const activities: HealthActivity[] = [];

      for (const workout of workouts) {
        const activity = await this.transformWorkout(workout);
        if (activity) {
          activities.push(activity);
        }
      }

      return activities;
    } catch (error) {
      console.error('[HealthKit] getWorkouts error:', error);
      return [];
    }
  }

  private async transformWorkout(workout: HKWorkout): Promise<HealthActivity | null> {
    try {
      const startedAt = workout.startDate;
      const endedAt = workout.endDate;
      const durationSeconds = Math.round(workout.duration);

      // Skip very short activities (less than 1 minute)
      if (durationSeconds < 60) return null;

      // Determine activity type from workout type
      const isRunning = workout.workoutActivityType === HKWorkoutActivityType.running;
      const activityType = isRunning ? 'run' : 'walk';

      // Distance in meters
      const distanceMeters = workout.totalDistance?.quantity || 0;

      // Skip activities with no meaningful distance
      if (distanceMeters < 50) return null;

      // Get steps for this workout period
      const steps = await this.getStepsForPeriod(startedAt, endedAt);

      // Calories
      const calories = workout.totalEnergyBurned?.quantity
        ? Math.round(workout.totalEnergyBurned.quantity)
        : undefined;

      // Anti-cheat: extract source info
      const sourceInfo = this.getSourceInfo(workout);
      const routePointCount = this.getRoutePointCount(workout);

      return {
        id: workout.uuid || `hk_${startedAt.getTime()}_${endedAt.getTime()}`,
        activityType,
        distanceMeters,
        durationSeconds,
        steps,
        calories,
        startedAt,
        endedAt,
        // Anti-cheat metadata
        sourceBundleId: sourceInfo.bundleId,
        sourceDeviceModel: sourceInfo.deviceModel,
        isManualEntry: sourceInfo.isManualEntry,
        routePointCount,
      };
    } catch (error) {
      console.error('[HealthKit] transformWorkout error:', error);
      return null;
    }
  }

  private getSourceInfo(workout: HKWorkout): {
    bundleId: string | null;
    deviceModel: string | null;
    isManualEntry: boolean;
  } {
    // Extract source bundle identifier (e.g., "com.apple.health")
    const bundleId =
      (workout as any).sourceRevision?.source?.bundleIdentifier ?? null;

    // Extract device model (e.g., "Watch" or "iPhone")
    const deviceModel = (workout as any).device?.model ?? null;

    // Check if manually entered by user
    const isManualEntry =
      (workout as any).metadata?.HKWasUserEntered === true ||
      (workout as any).metadata?.['HKWasUserEntered'] === 1;

    return { bundleId, deviceModel, isManualEntry };
  }

  private getRoutePointCount(workout: HKWorkout): number {
    try {
      // Try to access workout routes (available in v8+)
      const routes = (workout as any).workoutRoutes || [];
      if (!Array.isArray(routes)) return 0;

      return routes.reduce(
        (sum: number, route: any) => sum + (route.locations?.length || 0),
        0
      );
    } catch {
      return 0;
    }
  }

  private async getStepsForPeriod(startDate: Date, endDate: Date): Promise<number | undefined> {
    try {
      // v8 API: returns array directly, not { samples: [...] }
      const samples = await queryQuantitySamples(HKQuantityTypeIdentifier.stepCount, {
        from: startDate,
        to: endDate,
      });

      if (!samples || samples.length === 0) {
        return undefined;
      }

      // Sum all step samples in the period
      const totalSteps = samples.reduce((sum, sample) => sum + (sample.quantity || 0), 0);
      return Math.round(totalSteps);
    } catch (error) {
      console.error('[HealthKit] getStepsForPeriod error:', error);
      return undefined;
    }
  }

  /**
   * Get health baseline for onboarding (90 days default)
   * Uses passive step/distance tracking, not just workouts
   */
  async getBaseline(days: number = 90): Promise<HealthBaseline | null> {
    if (!this.authorized) {
      const permResult = await this.checkPermissions();
      if (permResult.status !== 'granted') {
        console.warn('[HealthKit] Not authorized to read baseline');
        return null;
      }
    }

    try {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      // Query steps (passive tracking, even without workouts)
      const stepSamples = await queryQuantitySamples(HKQuantityTypeIdentifier.stepCount, {
        from: startDate,
        to: endDate,
      });

      // Query distance (passive tracking)
      const distanceSamples = await queryQuantitySamples(
        HKQuantityTypeIdentifier.distanceWalkingRunning,
        { from: startDate, to: endDate }
      );

      // Query workouts
      const workouts = await queryWorkoutSamples({
        from: startDate,
        to: endDate,
        limit: 500, // Higher limit for 90 days
      });

      // Calculate totals
      const totalSteps = stepSamples.reduce((sum, s) => sum + (s.quantity || 0), 0);
      const totalDistanceMeters = distanceSamples.reduce((sum, s) => sum + (s.quantity || 0), 0);
      const totalWorkouts = workouts.length;
      const hasRunningWorkouts = workouts.some(
        (w) => w.workoutActivityType === HKWorkoutActivityType.running
      );

      // No data = return null
      if (totalSteps === 0 && totalDistanceMeters === 0) {
        console.log('[HealthKit] No baseline data found');
        return null;
      }

      // Calculate daily averages
      const avgDailySteps = Math.round(totalSteps / days);
      const avgDailyDistanceKm = Math.round((totalDistanceMeters / 1000 / days) * 100) / 100;

      console.log('[HealthKit] Baseline:', {
        avgDailySteps,
        avgDailyDistanceKm,
        totalWorkouts,
        hasRunningWorkouts,
      });

      return {
        avgDailySteps,
        avgDailyDistanceKm,
        totalWorkouts,
        hasRunningWorkouts,
      };
    } catch (error) {
      console.error('[HealthKit] getBaseline error:', error);
      return null;
    }
  }
}

export const healthKitService = new HealthKitService();
