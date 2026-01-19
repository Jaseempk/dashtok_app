import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { zustandStorage } from '@/lib/storage/mmkv';

interface UserPreferences {
  units: 'km' | 'miles';
  theme: 'dark' | 'light' | 'system';
}

interface UserState {
  onboardingCompleted: boolean;
  preferences: UserPreferences;

  // Actions
  setOnboardingCompleted: (completed: boolean) => void;
  setPreference: <K extends keyof UserPreferences>(key: K, value: UserPreferences[K]) => void;
  reset: () => void;
}

const initialState = {
  onboardingCompleted: false,
  preferences: {
    units: 'km' as const,
    theme: 'dark' as const,
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

      reset: () => set(initialState),
    }),
    {
      name: 'user-store',
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);
