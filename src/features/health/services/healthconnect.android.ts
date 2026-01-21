import {
  initialize,
  requestPermission,
  readRecords,
  getSdkStatus,
  SdkAvailabilityStatus,
} from 'react-native-health-connect';
import type {
  HealthService,
  HealthPermissionResult,
  HealthActivity,
} from '../types/health.types';

const PERMISSIONS = [
  { accessType: 'read', recordType: 'Steps' },
  { accessType: 'read', recordType: 'Distance' },
  { accessType: 'read', recordType: 'ExerciseSession' },
  { accessType: 'read', recordType: 'ActiveCaloriesBurned' },
] as const;

class HealthConnectService implements HealthService {
  private initialized = false;

  async isAvailable(): Promise<boolean> {
    try {
      const status = await getSdkStatus();
      return status === SdkAvailabilityStatus.SDK_AVAILABLE;
    } catch (error) {
      console.error('[HealthConnect] SDK status error:', error);
      return false;
    }
  }

  private async initializeIfNeeded(): Promise<boolean> {
    if (this.initialized) return true;

    try {
      const available = await this.isAvailable();
      if (!available) return false;

      const result = await initialize();
      this.initialized = result;
      return result;
    } catch (error) {
      console.error('[HealthConnect] Init error:', error);
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

    // Health Connect doesn't have a simple permission check API
    // We need to request and see what's granted
    return {
      status: 'not_determined',
      permissions: { steps: false, distance: false, workouts: false },
    };
  }

  async requestPermissions(): Promise<HealthPermissionResult> {
    const initialized = await this.initializeIfNeeded();
    if (!initialized) {
      return {
        status: 'unavailable',
        permissions: { steps: false, distance: false, workouts: false },
      };
    }

    try {
      const granted = await requestPermission(PERMISSIONS as any);

      // Check what was granted
      const hasSteps = granted.some((p: any) => p.recordType === 'Steps');
      const hasDistance = granted.some((p: any) => p.recordType === 'Distance');
      const hasWorkouts = granted.some((p: any) => p.recordType === 'ExerciseSession');

      const allGranted = hasSteps && hasDistance && hasWorkouts;

      return {
        status: allGranted ? 'granted' : granted.length > 0 ? 'granted' : 'denied',
        permissions: {
          steps: hasSteps,
          distance: hasDistance,
          workouts: hasWorkouts,
        },
      };
    } catch (error) {
      console.error('[HealthConnect] Request permission error:', error);
      return {
        status: 'denied',
        permissions: { steps: false, distance: false, workouts: false },
      };
    }
  }

  async getActivities(startDate: Date, endDate: Date): Promise<HealthActivity[]> {
    const initialized = await this.initializeIfNeeded();
    if (!initialized) return [];

    try {
      const exercises = await this.getExerciseSessions(startDate, endDate);
      return exercises;
    } catch (error) {
      console.error('[HealthConnect] Get activities error:', error);
      return [];
    }
  }

  private async getExerciseSessions(startDate: Date, endDate: Date): Promise<HealthActivity[]> {
    try {
      const result = await readRecords('ExerciseSession', {
        timeRangeFilter: {
          operator: 'between',
          startTime: startDate.toISOString(),
          endTime: endDate.toISOString(),
        },
      });

      const activities: HealthActivity[] = [];

      for (const session of result.records) {
        const activity = await this.transformSession(session, startDate, endDate);
        if (activity) {
          activities.push(activity);
        }
      }

      return activities;
    } catch (error) {
      console.error('[HealthConnect] Get exercise sessions error:', error);
      return [];
    }
  }

  private async transformSession(
    session: any,
    rangeStart: Date,
    rangeEnd: Date
  ): Promise<HealthActivity | null> {
    try {
      const startedAt = new Date(session.startTime);
      const endedAt = new Date(session.endTime);
      const durationSeconds = Math.round((endedAt.getTime() - startedAt.getTime()) / 1000);

      // Skip very short activities
      if (durationSeconds < 60) return null;

      // Determine activity type from exercise type
      const exerciseType = session.exerciseType || 0;
      // Walking = 79, Running = 56 in Health Connect
      const activityType = exerciseType === 56 ? 'run' : 'walk';

      // Get distance for this session
      const distanceMeters = await this.getDistanceForPeriod(startedAt, endedAt);
      if (distanceMeters < 50) return null;

      // Get steps and calories
      const steps = await this.getStepsForPeriod(startedAt, endedAt);
      const calories = await this.getCaloriesForPeriod(startedAt, endedAt);

      return {
        id: session.metadata?.id || `hc_${startedAt.getTime()}_${endedAt.getTime()}`,
        activityType,
        distanceMeters,
        durationSeconds,
        steps,
        calories,
        startedAt,
        endedAt,
      };
    } catch (error) {
      console.error('[HealthConnect] Transform session error:', error);
      return null;
    }
  }

  private async getDistanceForPeriod(startDate: Date, endDate: Date): Promise<number> {
    try {
      const result = await readRecords('Distance', {
        timeRangeFilter: {
          operator: 'between',
          startTime: startDate.toISOString(),
          endTime: endDate.toISOString(),
        },
      });

      let totalMeters = 0;
      for (const record of result.records) {
        totalMeters += (record as any).distance?.inMeters || 0;
      }
      return totalMeters;
    } catch {
      return 0;
    }
  }

  private async getStepsForPeriod(startDate: Date, endDate: Date): Promise<number | undefined> {
    try {
      const result = await readRecords('Steps', {
        timeRangeFilter: {
          operator: 'between',
          startTime: startDate.toISOString(),
          endTime: endDate.toISOString(),
        },
      });

      let totalSteps = 0;
      for (const record of result.records) {
        totalSteps += (record as any).count || 0;
      }
      return totalSteps > 0 ? totalSteps : undefined;
    } catch {
      return undefined;
    }
  }

  private async getCaloriesForPeriod(startDate: Date, endDate: Date): Promise<number | undefined> {
    try {
      const result = await readRecords('ActiveCaloriesBurned', {
        timeRangeFilter: {
          operator: 'between',
          startTime: startDate.toISOString(),
          endTime: endDate.toISOString(),
        },
      });

      let totalCalories = 0;
      for (const record of result.records) {
        totalCalories += (record as any).energy?.inKilocalories || 0;
      }
      return totalCalories > 0 ? Math.round(totalCalories) : undefined;
    } catch {
      return undefined;
    }
  }
}

export const healthConnectService = new HealthConnectService();
