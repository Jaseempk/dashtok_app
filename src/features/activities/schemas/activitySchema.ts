import { z } from 'zod';

// Mirrors server validation for client-side UX feedback
// Server re-validates everything - this is NOT security, just UX

export const activityTypeSchema = z.enum(['run', 'walk']);
export const activitySourceSchema = z.enum(['healthkit', 'gps_tracked', 'manual']);

export const createActivitySchema = z.object({
  activityType: activityTypeSchema,
  distanceMeters: z.number().positive('Distance must be greater than 0'),
  durationSeconds: z.number().int().positive('Duration is required'),
  steps: z.number().int().nonnegative().optional(),
  calories: z.number().int().nonnegative().optional(),
  startedAt: z.string().datetime(),
  endedAt: z.string().datetime(),
  source: activitySourceSchema,
  healthkitId: z.string().optional(),
});

// Form-specific schema (uses Date objects for pickers)
export const logActivityFormSchema = z.object({
  activityType: activityTypeSchema,
  distanceKm: z.number().positive('Distance must be greater than 0'),
  hours: z.number().int().min(0).max(23),
  minutes: z.number().int().min(0).max(59),
  seconds: z.number().int().min(0).max(59),
  startedAt: z.date().refine((date) => date <= new Date(), {
    message: 'Start time cannot be in the future',
  }),
  steps: z.number().int().nonnegative().optional(),
  calories: z.number().int().nonnegative().optional(),
}).refine((data) => {
  const totalSeconds = data.hours * 3600 + data.minutes * 60 + data.seconds;
  return totalSeconds > 0;
}, {
  message: 'Duration must be greater than 0',
  path: ['minutes'],
});

export type LogActivityFormData = z.infer<typeof logActivityFormSchema>;
