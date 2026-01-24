// Activity types - mirrors server schema
export type ActivityType = 'run' | 'walk';
export type ActivitySource = 'healthkit' | 'gps_tracked' | 'manual';

export interface Activity {
  id: string;
  userId: string;
  activityType: ActivityType;
  distanceMeters: number;
  durationSeconds: number;
  steps: number | null;
  calories: number | null;
  startedAt: string;
  endedAt: string;
  source: ActivitySource;
  isVerified: boolean;
  healthkitId: string | null;
  createdAt: string;
}

// API response types
export interface ActivityListResponse {
  data: Activity[];
  total: number;
  page: number;
  limit: number;
}

export interface ActivityFilters {
  from?: string;
  to?: string;
  type?: ActivityType;
  limit?: number;
  page?: number;
}

// For creating activities
export interface CreateActivityInput {
  activityType: ActivityType;
  distanceMeters: number;
  durationSeconds: number;
  steps?: number;
  calories?: number;
  startedAt: string;
  endedAt: string;
  source: ActivitySource;
  healthkitId?: string;
  // Anti-cheat: source metadata
  sourceBundleId?: string | null;
  sourceDeviceModel?: string | null;
  isManualEntry?: boolean;
  routePointCount?: number;
}

// Computed stats for display
export interface ActivityStats {
  totalDistance: number; // meters
  totalDuration: number; // seconds
  count: number;
}

// Filter period options
export type FilterPeriod = 'today' | 'week' | 'month' | 'all';
