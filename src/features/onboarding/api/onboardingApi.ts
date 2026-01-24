import { api } from '@/lib/api/client';
import type {
  GoalRecommendation,
  HealthBaseline,
  BehaviorScores,
  AgeRange,
  Gender,
  HeightRange,
  FitnessLevel,
  ActivityType,
} from '../types/onboarding.types';

interface GenerateGoalRequest {
  ageRange: AgeRange;
  gender: Gender;
  heightRange: HeightRange;
  fitnessLevel: FitnessLevel;
  behaviorScore: number;
  behaviorBreakdown: {
    unconsciousUsage: number;
    timeDisplacement: number;
    productivityImpact: number;
    failedRegulation: number;
  };
  activityType: ActivityType;
  healthBaseline: HealthBaseline | null;
}

interface GenerateGoalResponse {
  success: boolean;
  data: GoalRecommendation;
}

export const onboardingApi = {
  /**
   * Generate personalized goal recommendation via LLM
   */
  generateGoal: async (data: GenerateGoalRequest): Promise<GoalRecommendation> => {
    const response = await api.post<GenerateGoalResponse>('/onboarding/generate-goal', data);
    return response.data;
  },
};
