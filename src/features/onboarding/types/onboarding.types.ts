// Frequency scale for behavior questions (0-3)
export type Frequency = 0 | 1 | 2 | 3;

// Demographics
export type AgeRange = '18-24' | '25-34' | '35-44' | '45-54' | '55+';
export type Gender = 'male' | 'female' | 'other' | 'prefer-not';
export type HeightRange = 'under-150' | '150-165' | '165-180' | 'over-180' | 'prefer-not';

// Fitness
export type FitnessLevel = 'sedentary' | 'light' | 'moderate' | 'active';
export type ActivityType = 'walk' | 'run';

// Profile types from LLM
export type ProfileType = 'rebuilder' | 'starter' | 'optimizer' | 'guardian';

// Behavior assessment scores
export interface BehaviorScores {
  unconsciousUsage: Frequency | null;
  timeDisplacement: Frequency | null;
  productivityImpact: Frequency | null;
  failedRegulation: Frequency | null;
}

// Health baseline from HealthKit (90 days)
export interface HealthBaseline {
  avgDailySteps: number;
  avgDailyDistanceKm: number;
  totalWorkouts: number;
  hasRunningWorkouts: boolean;
}

// LLM-generated goal recommendation
export interface GoalRecommendation {
  suggestedDistanceKm: number;
  suggestedRewardMinutes: number;
  reasoning: string;
  profileType: ProfileType;
  profileTitle: string;
  profileInsight: string;
  successProbability: number;
  projectedGain: string;
}

// Notification preferences
export interface NotificationPreferences {
  dailyReminders: boolean;
  streakAlerts: boolean;
  weeklySummary: boolean;
}
