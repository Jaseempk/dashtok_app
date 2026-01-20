// Goal types - mirrors server schema exactly

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

// API request types
export interface CreateGoalInput {
  goalType: GoalType;
  activityType: GoalActivityType;
  targetValue: number;
  targetUnit: GoalUnit;
  rewardMinutes: number;
}

export interface UpdateGoalInput {
  targetValue?: number;
  rewardMinutes?: number;
  isActive?: boolean;
}

// API response types
export interface GoalListResponse {
  data: Goal[];
}

// For computing progress (will come from activities)
export interface GoalWithProgress extends Goal {
  currentProgress: number; // 0-100 percentage
  currentValue: number; // actual value achieved
}
