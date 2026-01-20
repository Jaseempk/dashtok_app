export interface User {
  id: string;
  email: string;
  name: string | null;
  timezone: string;
  onboardingCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateUserInput {
  name?: string;
  timezone?: string;
  onboardingCompleted?: boolean;
}
