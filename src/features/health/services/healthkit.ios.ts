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
      await requestAuthorization([...READ_PERMISSIONS]);

      this.authorized = true;
      return {
        status: 'granted',
        permissions: { steps: true, distance: true, workouts: true },
      };
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

      return {
        id: workout.uuid || `hk_${startedAt.getTime()}_${endedAt.getTime()}`,
        activityType,
        distanceMeters,
        durationSeconds,
        steps,
        calories,
        startedAt,
        endedAt,
      };
    } catch (error) {
      console.error('[HealthKit] transformWorkout error:', error);
      return null;
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
}

export const healthKitService = new HealthKitService();
