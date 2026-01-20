import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { zustandStorage } from '@/lib/storage/mmkv';

interface UserPreferences {
  units: 'km' | 'miles';
  theme: 'dark' | 'light' | 'system';
}

interface NotificationPreferences {
  dailyReminders: boolean;
  streakAlerts: boolean;
}

interface UserState {
  onboardingCompleted: boolean;
  preferences: UserPreferences;
  notifications: NotificationPreferences;

  // Actions
  setOnboardingCompleted: (completed: boolean) => void;
  setPreference: <K extends keyof UserPreferences>(key: K, value: UserPreferences[K]) => void;
  setNotification: <K extends keyof NotificationPreferences>(key: K, value: boolean) => void;
  reset: () => void;
}

const initialState = {
  onboardingCompleted: false,
  preferences: {
    units: 'km' as const,
    theme: 'dark' as const,
  },
  notifications: {
    dailyReminders: true,
    streakAlerts: true,
  },
};

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      ...initialState,

      setOnboardingCompleted: (completed) => set({ onboardingCompleted: completed }),

      setPreference: (key, value) =>
        set((state) => ({
          preferences: { ...state.preferences, [key]: value },
        })),

      setNotification: (key, value) =>
        set((state) => ({
          notifications: { ...state.notifications, [key]: value },
        })),

      reset: () => set(initialState),
    }),
    {
      name: 'user-store',
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);
