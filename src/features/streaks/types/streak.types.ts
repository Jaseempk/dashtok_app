export interface Streak {
  id: string;
  userId: string;
  currentStreak: number;
  longestStreak: number;
  lastCompletedDate: string | null;
  multiplier: number;
  createdAt: string;
  updatedAt: string;
}

// Multiplier tiers for display
export const STREAK_TIERS = [
  { minDays: 1, maxDays: 6, multiplier: 1.0, name: 'Starter', color: '#6b7280' },
  { minDays: 7, maxDays: 13, multiplier: 1.1, name: 'Bronze', color: '#cd7f32' },
  { minDays: 14, maxDays: 29, multiplier: 1.25, name: 'Silver', color: '#c0c0c0' },
  { minDays: 30, maxDays: Infinity, multiplier: 1.5, name: 'Gold', color: '#ffd700' },
] as const;

export type StreakTierName = typeof STREAK_TIERS[number]['name'];

export function getStreakTier(days: number) {
  return STREAK_TIERS.find(tier => days >= tier.minDays && days <= tier.maxDays) ?? STREAK_TIERS[0];
}

export function getNextTier(days: number) {
  const currentTierIndex = STREAK_TIERS.findIndex(
    tier => days >= tier.minDays && days <= tier.maxDays
  );
  if (currentTierIndex === -1 || currentTierIndex === STREAK_TIERS.length - 1) {
    return null;
  }
  return STREAK_TIERS[currentTierIndex + 1];
}

// Milestone days for celebration
export const STREAK_MILESTONES = [7, 14, 30, 50, 100] as const;

export function isStreakMilestone(days: number): boolean {
  return STREAK_MILESTONES.includes(days as typeof STREAK_MILESTONES[number]);
}
