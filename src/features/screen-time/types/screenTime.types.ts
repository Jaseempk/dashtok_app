// Blocked Apps Types
export interface BlockedApps {
  id: string;
  selectionId: string;
  appCount: number;
  categoryCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  // Pending changes (24h cooldown for permissive changes)
  hasPendingChanges: boolean;
  pendingAppCount: number | null;
  pendingCategoryCount: number | null;
  pendingIsActive: boolean | null;
  pendingAppliesAt: string | null;
}

export interface CreateBlockedAppsInput {
  selectionData: string;
  selectionId: string;
  appCount: number;
  categoryCount: number;
}

export interface UpdateBlockedAppsInput {
  isActive?: boolean;
  selectionData?: string;
  selectionId?: string;
  appCount?: number;
  categoryCount?: number;
}

// Enforcement Types
export type EnforcementReason =
  | 'goal_incomplete'
  | 'time_exhausted'
  | 'unlocked'
  | 'enforcement_disabled'
  | 'no_blocked_apps';

export interface NextUnlockRequirement {
  type: 'distance';
  current: number;
  target: number;
  unit: 'km' | 'miles';
  percentComplete: number;
}

export interface EnforcementStatus {
  shouldBlock: boolean;
  reason: EnforcementReason;
  remainingMinutes: number;
  totalMinutes: number;
  usedMinutes: number;
  nextUnlockRequirement: NextUnlockRequirement | null;
  emergencyBypassAvailable: boolean;
  emergencyBypassesLeft: number;
  isUnlocked: boolean;
}

export interface UnlockResult {
  unlocked: boolean;
  reason?: EnforcementReason;
  durationMinutes?: number;
}

export interface LockResult {
  locked: boolean;
}

export interface BypassResult {
  granted: boolean;
  reason?: 'daily_limit_reached';
  minutesGranted?: number;
  bypassesRemaining?: number;
}

// Usage Session Types
export type UsageSource = 'app_foreground' | 'threshold_event' | 'manual';

export interface UsageSession {
  id: string;
  userId: string;
  allowanceId: string | null;
  startedAt: string;
  endedAt: string | null;
  durationSeconds: number | null;
  source: UsageSource;
  createdAt: string;
}

export interface StartSessionInput {
  source: UsageSource;
  /** Idempotency key for offline queue deduplication */
  idempotencyKey?: string;
}

export interface StartSessionResult {
  sessionId: string;
  startedAt: string;
  /** True if this was a duplicate request (already exists) */
  isDuplicate?: boolean;
}

export interface EndSessionInput {
  sessionId: string;
  /** Idempotency key for offline queue deduplication */
  idempotencyKey?: string;
}

export interface EndSessionResult {
  durationSeconds: number;
  remainingMinutes: number;
  /** True if this was a duplicate request (already processed) */
  isDuplicate?: boolean;
}

export interface TodayUsage {
  totalMinutes: number;
  sessions: UsageSession[];
}

// Shield Configuration Types
export interface ShieldColor {
  red: number;
  green: number;
  blue: number;
}

export interface ShieldConfig {
  title: string;
  subtitle: string;
  titleColor?: ShieldColor;
  subtitleColor?: ShieldColor;
  backgroundColor?: ShieldColor;
  primaryButtonLabel?: string;
  primaryButtonBackgroundColor?: ShieldColor;
  primaryButtonLabelColor?: ShieldColor;
  secondaryButtonLabel?: string;
  secondaryButtonLabelColor?: ShieldColor;
  iconSystemName?: string;
}

export interface ShieldActions {
  primary?: {
    type: 'close' | 'dismiss';
    behavior: 'close' | 'defer';
  };
  secondary?: {
    type: 'close' | 'dismiss';
    behavior: 'close' | 'defer';
  };
}
