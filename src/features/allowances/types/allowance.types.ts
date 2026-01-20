export interface Allowance {
  id: string;
  userId: string;
  date: string;
  earnedMinutes: number;
  usedMinutes: number;
  bonusMinutes: number;
  isUnlocked: boolean;
  unlockedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface TodayAllowance extends Allowance {
  remainingMinutes: number;
  totalMinutes: number;
}

export interface AllowanceHistoryFilters {
  from?: string;
  to?: string;
  limit?: number;
}

export interface UpdateUsedMinutesInput {
  usedMinutes: number;
}
