import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { zustandStorage } from '@/lib/storage/mmkv';
import type {
  AgeRange,
  Gender,
  HeightRange,
  FitnessLevel,
  ActivityType,
  Frequency,
  BehaviorScores,
  HealthBaseline,
  GoalRecommendation,
  NotificationPreferences,
} from '../types/onboarding.types';

interface OnboardingState {
  // Demographics (about-you)
  ageRange: AgeRange | null;
  gender: Gender | null;
  heightRange: HeightRange | null;

  // Permissions (health-permissions)
  healthConnected: boolean;

  // Fitness (fitness-habits)
  fitnessLevel: FitnessLevel | null;

  // Behavior assessment (behavior-1 to behavior-4)
  behaviorScores: BehaviorScores;

  // Activity preference (activity-type)
  activityType: ActivityType | null;

  // Health baseline (computed in analyzing)
  healthBaseline: HealthBaseline | null;

  // LLM recommendation (computed in analyzing)
  goalRecommendation: GoalRecommendation | null;

  // Final goal selection (goal-recommendation)
  dailyTargetKm: number;
  userAdjustedGoal: boolean;

  // App blocking (app-blocking)
  screenTimeAuthorized: boolean;
  blockedAppsSelection: string | null;
  blockedAppsCount: number;
  blockedCategoriesCount: number;

  // Notifications (notifications)
  notificationsEnabled: boolean;
  notificationPreferences: NotificationPreferences;

  // Computed helpers
  getBehaviorScore: () => number;
  getRewardMinutes: () => number;

  // Actions - Demographics
  setAgeRange: (value: AgeRange) => void;
  setGender: (value: Gender) => void;
  setHeightRange: (value: HeightRange) => void;

  // Actions - Fitness
  setFitnessLevel: (value: FitnessLevel) => void;
  setBehaviorScore: (key: keyof BehaviorScores, value: Frequency) => void;
  setActivityType: (value: ActivityType) => void;

  // Actions - Health
  setHealthConnected: (connected: boolean) => void;
  setHealthBaseline: (value: HealthBaseline | null) => void;

  // Actions - Goal
  setGoalRecommendation: (value: GoalRecommendation) => void;
  setDailyTargetKm: (value: number) => void;
  setUserAdjustedGoal: (value: boolean) => void;

  // Actions - App Blocking
  setScreenTimeAuthorized: (authorized: boolean) => void;
  setBlockedAppsSelection: (selection: string | null, appCount: number, categoryCount: number) => void;

  // Actions - Notifications
  setNotificationsEnabled: (enabled: boolean) => void;
  setNotificationPreference: (key: keyof NotificationPreferences, value: boolean) => void;

  // Reset
  reset: () => void;
}

const initialBehaviorScores: BehaviorScores = {
  unconsciousUsage: null,
  timeDisplacement: null,
  productivityImpact: null,
  failedRegulation: null,
};

const initialState = {
  // Demographics
  ageRange: null,
  gender: null,
  heightRange: null,

  // Permissions
  healthConnected: false,

  // Fitness
  fitnessLevel: null,
  behaviorScores: initialBehaviorScores,
  activityType: null,

  // Health baseline
  healthBaseline: null,

  // Goal recommendation
  goalRecommendation: null,
  dailyTargetKm: 2.0,
  userAdjustedGoal: false,

  // App blocking
  screenTimeAuthorized: false,
  blockedAppsSelection: null,
  blockedAppsCount: 0,
  blockedCategoriesCount: 0,

  // Notifications
  notificationsEnabled: false,
  notificationPreferences: {
    dailyReminders: true,
    streakAlerts: true,
    weeklySummary: false,
  },
};

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set, get) => ({
      ...initialState,

      // Computed: Total behavior score (0-12)
      getBehaviorScore: () => {
        const { behaviorScores } = get();
        const values = Object.values(behaviorScores).filter((v): v is Frequency => v !== null);
        return values.reduce<number>((sum, v) => sum + v, 0);
      },

      // Computed: Reward minutes based on distance and activity
      getRewardMinutes: () => {
        const { dailyTargetKm, activityType } = get();
        const multiplier = activityType === 'run' ? 22 : 15;
        return Math.round(dailyTargetKm * multiplier);
      },

      // Demographics
      setAgeRange: (value) => set({ ageRange: value }),
      setGender: (value) => set({ gender: value }),
      setHeightRange: (value) => set({ heightRange: value }),

      // Fitness
      setFitnessLevel: (value) => set({ fitnessLevel: value }),

      setBehaviorScore: (key, value) =>
        set((state) => ({
          behaviorScores: {
            ...state.behaviorScores,
            [key]: value,
          },
        })),

      setActivityType: (value) => set({ activityType: value }),

      // Health
      setHealthConnected: (connected) => set({ healthConnected: connected }),
      setHealthBaseline: (value) => set({ healthBaseline: value }),

      // Goal
      setGoalRecommendation: (value) =>
        set({
          goalRecommendation: value,
          dailyTargetKm: value.suggestedDistanceKm,
          userAdjustedGoal: false,
        }),

      setDailyTargetKm: (value) => set({ dailyTargetKm: value }),
      setUserAdjustedGoal: (value) => set({ userAdjustedGoal: value }),

      // App Blocking
      setScreenTimeAuthorized: (authorized) => set({ screenTimeAuthorized: authorized }),

      setBlockedAppsSelection: (selection, appCount, categoryCount) =>
        set({
          blockedAppsSelection: selection,
          blockedAppsCount: appCount,
          blockedCategoriesCount: categoryCount,
        }),

      // Notifications
      setNotificationsEnabled: (enabled) => set({ notificationsEnabled: enabled }),

      setNotificationPreference: (key, value) =>
        set((state) => ({
          notificationPreferences: {
            ...state.notificationPreferences,
            [key]: value,
          },
        })),

      // Reset
      reset: () => set(initialState),
    }),
    {
      name: 'onboarding-store',
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);
