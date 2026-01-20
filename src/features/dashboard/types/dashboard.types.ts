// Activity types
export type ActivityType = 'run' | 'walk';
export type ActivitySource = 'gps_tracked' | 'healthkit' | 'manual';

export interface TodayStats {
  totalDistance: number; // meters
  totalDuration: number; // seconds
  count: number;
}

// Allowance types
export interface TodayAllowance {
  id: string;
  userId: string;
  date: string;
  earnedMinutes: number;
  usedMinutes: number;
  bonusMinutes: number;
  isUnlocked: boolean;
  unlockedAt: string | null;
  remainingMinutes: number;
  totalMinutes: number;
}

// Streak types
export type StreakTier = 'none' | 'bronze' | 'silver' | 'gold' | 'platinum';

export interface Streak {
  id: string;
  userId: string;
  currentStreak: number;
  longestStreak: number;
  lastCompletedDate: string | null;
  multiplier: number;
}

// Goal types
export type GoalType = 'daily' | 'weekly';
export type GoalActivityType = 'run' | 'walk' | 'any';
export type GoalUnit = 'km' | 'miles' | 'steps';

export interface Goal {
  id: string;
  userId: string;
  goalType: GoalType;
  activityType: GoalActivityType;
  targetValue: number;
  targetUnit: GoalUnit;
  rewardMinutes: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// API Response wrapper
export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

// Dashboard computed values (for UI)
export interface DashboardData {
  todayStats: TodayStats;
  allowance: TodayAllowance;
  streak: Streak;
  activeGoal: Goal | null;
  progress: {
    distanceMeters: number;
    targetMeters: number;
    percentage: number;
    earnedMinutes: number;
    targetMinutes: number;
  };
}
