import type {
  InterviewDifficultyOption,
  InterviewStyleOption,
} from "@/shared/constants/interview-page/setting-interview";

export type InterviewerTemplateRole = "TECH" | "HR" | "CEO" | "PM" | "DESIGN";

export type InterviewerCount = 2 | 3 | 4;
export type SlotIndex = 0 | 1 | 2 | 3;
export type InterviewerPersonality = "FRIENDLY" | "METICULOUS" | "REALISTIC";
export type InterviewerTone = "GENTLE" | "DIRECT" | "PRESSURING";

export interface InterviewerSlot {
  interviewer: InterviewerTemplate | null;
  role: InterviewerTemplateRole | null;
  personality: InterviewerPersonality;
  tone: InterviewerTone;
  major: "BACKEND" | "FRONTEND";
}

export interface InterviewerTemplate {
  key: string;
  name: string;
  voiceIndex: 1 | 2 | 3 | 4 | 5;
  role: InterviewerTemplateRole;
  roleLabel: string;
  specialty: string;
  major?: "BACKEND" | "FRONTEND";
  career: number;
  gender: "MALE" | "FEMALE";
  image: string;
  tags: readonly string[];
  description: string;
}

export interface MultiInterviewSelection {
  style: InterviewStyleOption;
  difficulty: InterviewDifficultyOption;
  activeSlot: SlotIndex;
  interviewerCount: InterviewerCount;
  slots: InterviewerSlot[];
}

export interface MultiInterviewValidation {
  hasDuplicateInterviewer: boolean;
  hasDuplicateRole: boolean;
}
