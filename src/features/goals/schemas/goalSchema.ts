import { z } from 'zod';

// Mirrors server validation for client-side UX feedback
// Server re-validates everything - this is NOT security, just UX

export const goalTypeSchema = z.enum(['daily', 'weekly']);
export const goalActivityTypeSchema = z.enum(['run', 'walk', 'any']);
export const goalUnitSchema = z.enum(['km', 'miles', 'steps']);

export const createGoalFormSchema = z.object({
  goalType: goalTypeSchema,
  activityType: goalActivityTypeSchema,
  targetValue: z.number().positive('Target must be greater than 0'),
  targetUnit: goalUnitSchema,
  rewardMinutes: z
    .number()
    .int()
    .positive('Reward must be greater than 0')
    .max(480, 'Maximum reward is 8 hours (480 minutes)'),
});

export const updateGoalFormSchema = z.object({
  targetValue: z.number().positive().optional(),
  rewardMinutes: z.number().int().positive().max(480).optional(),
  isActive: z.boolean().optional(),
});

export type CreateGoalFormData = z.infer<typeof createGoalFormSchema>;
export type UpdateGoalFormData = z.infer<typeof updateGoalFormSchema>;
