import type { IconName } from "@/components/ui";
import { ProfileType } from "../store/onboardingStore";

export const PROFILE_CONTENT: Record<
  ProfileType,
  {
    title: string;
    subtitle: string;
    description: string;
    successRate: number;
    trajectory: string;
    trajectoryGain: string;
  }
> = {
  "inconsistent-achiever": {
    title: "The Inconsistent",
    subtitle: "Achiever",
    description:
      "You have strong intentions but lack a tangible reward system to bridge the gap between intention and action.",
    successRate: 87,
    trajectory: "Exponential Growth",
    trajectoryGain: "+150%",
  },
  "fresh-starter": {
    title: "The Fresh",
    subtitle: "Starter",
    description:
      "You're beginning your fitness journey with a clean slate. The right system from day one will set you up for lasting success.",
    successRate: 92,
    trajectory: "Steady Climb",
    trajectoryGain: "+200%",
  },
  "accountability-seeker": {
    title: "The Accountability",
    subtitle: "Seeker",
    description:
      "You've built good habits but want external motivation to reach the next level. Rewards will amplify your existing discipline.",
    successRate: 94,
    trajectory: "Accelerated Progress",
    trajectoryGain: "+120%",
  },
  "motivated-parent": {
    title: "The Motivated",
    subtitle: "Parent",
    description:
      "You're setting up a healthy relationship between screen time and physical activity for your child. Smart parenting starts here.",
    successRate: 89,
    trajectory: "Healthy Habits",
    trajectoryGain: "+180%",
  },
};

export const SOLUTION_PILLARS: {
  icon: IconName;
  title: string;
  description: string;
}[] = [
  {
    icon: "lock",
    title: "Earn Before You Scroll",
    description: "Lock distracting apps until you hit your step goal.",
  },
  {
    icon: "flame",
    title: "Small Wins, Big Streaks",
    description: "Build momentum with micro-goals tailored to your pace.",
  },
  {
    icon: "target",
    title: "No Guilt, Just Balance",
    description: "Flex days allow you to rest without breaking your streak.",
  },
];

export const ACTIVITY_OPTIONS = [
  {
    type: "walk" as const,
    title: "Walking",
    badge: "Beginner Friendly",
    badgeVariant: "amber" as const,
    targetText: "~20 min/day",
    targetIcon: "time" as const,
    image: require("@/assets/images/activity-walk.png"),
  },
  {
    type: "run" as const,
    title: "Running",
    badge: "High Intensity",
    badgeVariant: "amber" as const,
    targetText: "~45 min/day",
    targetIcon: "flash" as const,
    image: require("@/assets/images/activity-run.png"),
  },
  {
    type: "any" as const,
    title: "Mixed Cardio",
    badge: "Flexible",
    badgeVariant: "neutral" as const,
    targetText: "Heart Rate",
    targetIcon: "heart" as const,
    image: require("@/assets/images/activity-cardio.png"),
  },
];

export const HEALTH_PERMISSIONS: {
  icon: IconName;
  title: string;
  description: string;
}[] = [
  {
    icon: "walk",
    title: "Steps & Cadence",
    description: "Track your daily movement rhythm",
  },
  {
    icon: "target",
    title: "Distance",
    description: "Measure your cardio milestones",
  },
  {
    icon: "chart",
    title: "Workout Intensity",
    description: "Monitor your effort levels",
  },
];

export const NOTIFICATION_TYPES: {
  icon: IconName;
  title: string;
  preview: string;
  time: string;
}[] = [
  {
    icon: "bell",
    title: "Morning kick-off",
    preview: "Sun's up! Let's hit that 5k goal today.",
    time: "NOW",
  },
  {
    icon: "flame",
    title: "Streak at risk",
    preview: "Don't break your 7-day streak!",
    time: "2h ago",
  },
  {
    icon: "trophy",
    title: "Goal crushed!",
    preview: "You just earned the 'Early Bird' badge.",
    time: "1d ago",
  },
];
