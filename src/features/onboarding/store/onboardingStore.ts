import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { zustandStorage } from '@/lib/storage/mmkv';

export type ConsistencyLevel =
  | 'start-strong'
  | 'inconsistent'
  | 'accountability'
  | 'rarely';

export type ScreenTimeFeeling =
  | 'guilty'
  | 'wish-moved'
  | 'no-system'
  | 'for-child';

export type PastAppIssue =
  | 'bored'
  | 'no-reward'
  | 'complicated'
  | 'forgot'
  | 'first-app';

export type ActivityType = 'walk' | 'run' | 'any';

export type ProfileType =
  | 'inconsistent-achiever'
  | 'fresh-starter'
  | 'accountability-seeker'
  | 'motivated-parent';

interface OnboardingState {
  // Survey answers
  consistencyLevel: ConsistencyLevel | null;
  screenTimeFeeling: ScreenTimeFeeling | null;
  pastAppIssues: PastAppIssue[];

  // Goal setup
  activityType: ActivityType | null;
  dailyTargetKm: number;
  weekendAdjust: boolean;

  // Permissions
  healthConnected: boolean;
  notificationsEnabled: boolean;
  notificationPreferences: {
    dailyReminders: boolean;
    streakAlerts: boolean;
    weeklySummary: boolean;
  };

  // Computed
  profileType: ProfileType | null;

  // Actions
  setConsistencyLevel: (level: ConsistencyLevel) => void;
  setScreenTimeFeeling: (feeling: ScreenTimeFeeling) => void;
  togglePastAppIssue: (issue: PastAppIssue) => void;
  setActivityType: (type: ActivityType) => void;
  setDailyTargetKm: (km: number) => void;
  setWeekendAdjust: (enabled: boolean) => void;
  setHealthConnected: (connected: boolean) => void;
  setNotificationsEnabled: (enabled: boolean) => void;
  setNotificationPreference: (key: keyof OnboardingState['notificationPreferences'], value: boolean) => void;
  computeProfile: () => void;
  getRewardMinutes: () => number;
  reset: () => void;
}

const initialState = {
  consistencyLevel: null,
  screenTimeFeeling: null,
  pastAppIssues: [],
  activityType: null,
  dailyTargetKm: 2.0,
  weekendAdjust: false,
  healthConnected: false,
  notificationsEnabled: false,
  notificationPreferences: {
    dailyReminders: true,
    streakAlerts: true,
    weeklySummary: false,
  },
  profileType: null,
};

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set, get) => ({
      ...initialState,

      setConsistencyLevel: (level) => set({ consistencyLevel: level }),

      setScreenTimeFeeling: (feeling) => set({ screenTimeFeeling: feeling }),

      togglePastAppIssue: (issue) =>
        set((state) => {
          // If selecting "first-app", clear others
          if (issue === 'first-app') {
            return {
              pastAppIssues: state.pastAppIssues.includes(issue) ? [] : [issue],
            };
          }

          // If selecting other issue, remove "first-app"
          const filtered = state.pastAppIssues.filter((i) => i !== 'first-app');

          if (filtered.includes(issue)) {
            return { pastAppIssues: filtered.filter((i) => i !== issue) };
          }
          return { pastAppIssues: [...filtered, issue] };
        }),

      setActivityType: (type) => set({ activityType: type }),

      setDailyTargetKm: (km) => set({ dailyTargetKm: km }),

      setWeekendAdjust: (enabled) => set({ weekendAdjust: enabled }),

      setHealthConnected: (connected) => set({ healthConnected: connected }),

      setNotificationsEnabled: (enabled) => set({ notificationsEnabled: enabled }),

      setNotificationPreference: (key, value) =>
        set((state) => ({
          notificationPreferences: {
            ...state.notificationPreferences,
            [key]: value,
          },
        })),

      computeProfile: () => {
        const { consistencyLevel, screenTimeFeeling, pastAppIssues } = get();

        let profileType: ProfileType = 'inconsistent-achiever';

        if (screenTimeFeeling === 'for-child') {
          profileType = 'motivated-parent';
        } else if (pastAppIssues.includes('first-app')) {
          profileType = 'fresh-starter';
        } else if (consistencyLevel === 'accountability') {
          profileType = 'accountability-seeker';
        }

        set({ profileType });
      },

      getRewardMinutes: () => {
        const { dailyTargetKm, activityType } = get();
        // Base: 15 min per km for walking, 22 min per km for running
        const multiplier = activityType === 'run' ? 22 : 15;
        return Math.round(dailyTargetKm * multiplier);
      },

      reset: () => set(initialState),
    }),
    {
      name: 'onboarding-store',
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);
