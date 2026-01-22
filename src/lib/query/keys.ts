export const queryKeys = {
  // Activities
  activities: {
    all: ['activities'] as const,
    today: () => [...queryKeys.activities.all, 'today'] as const,
    list: (filters?: { from?: string; to?: string; type?: string }) =>
      [...queryKeys.activities.all, 'list', filters] as const,
    detail: (id: string) => [...queryKeys.activities.all, 'detail', id] as const,
  },

  // Allowances
  allowances: {
    all: ['allowances'] as const,
    today: () => [...queryKeys.allowances.all, 'today'] as const,
    history: (filters?: { days?: number }) =>
      [...queryKeys.allowances.all, 'history', filters] as const,
  },

  // Streaks
  streaks: {
    all: ['streaks'] as const,
    current: () => [...queryKeys.streaks.all, 'current'] as const,
  },

  // Goals
  goals: {
    all: ['goals'] as const,
    active: () => [...queryKeys.goals.all, 'active'] as const,
    list: (activeOnly?: boolean) =>
      [...queryKeys.goals.all, 'list', { activeOnly }] as const,
    detail: (id: string) => [...queryKeys.goals.all, 'detail', id] as const,
  },

  // User
  user: {
    all: ['user'] as const,
    profile: () => [...queryKeys.user.all, 'profile'] as const,
  },

  // Blocked Apps
  blockedApps: {
    all: ['blockedApps'] as const,
    current: () => [...queryKeys.blockedApps.all, 'current'] as const,
  },

  // Enforcement
  enforcement: {
    all: ['enforcement'] as const,
    status: () => [...queryKeys.enforcement.all, 'status'] as const,
  },

  // Usage
  usage: {
    all: ['usage'] as const,
    today: () => [...queryKeys.usage.all, 'today'] as const,
    session: (id: string) => [...queryKeys.usage.all, 'session', id] as const,
  },
} as const;
