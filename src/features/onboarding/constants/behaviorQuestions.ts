import type { IconName } from "@/components/ui";
import type { BehaviorScores } from "../types/onboarding.types";

export interface BehaviorQuestion {
  key: keyof BehaviorScores;
  question: string;
  icon: IconName;
  nextRoute: string;
}

export const BEHAVIOR_QUESTIONS: BehaviorQuestion[] = [
  {
    key: "unconsciousUsage",
    question: "Opened social media or apps without thinking?",
    icon: "phone-portrait",
    nextRoute: "/(onboarding)/behavior-2",
  },
  {
    key: "timeDisplacement",
    question: "Chosen scrolling over exercise or going outside?",
    icon: "tv",
    nextRoute: "/(onboarding)/behavior-3",
  },
  {
    key: "productivityImpact",
    question: "Got distracted by your phone during work or tasks?",
    icon: "briefcase",
    nextRoute: "/(onboarding)/behavior-4",
  },
  {
    key: "failedRegulation",
    question: "Tried to use your phone less but couldn't stick to it?",
    icon: "refresh",
    nextRoute: "/(onboarding)/activity-type",
  },
];
