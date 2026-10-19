import type { VoiceIndex } from "@/shared/constants/interview-page/voice-catalog";
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
}

export interface InterviewerTemplate {
  key: string;
  name: string;
  voiceIndex: VoiceIndex;
  role: InterviewerTemplateRole;
  roleLabel: string;
  career: number;
  gender: "MALE" | "FEMALE";
  image: string;
  tags: readonly string[];
  description: string;
}

export interface MultiInterviewSelection {
  style: InterviewStyleOption | null;
  difficulty: InterviewDifficultyOption;
  activeSlot: SlotIndex;
  interviewerCount: InterviewerCount;
  slots: InterviewerSlot[];
}

export interface MultiInterviewValidation {
  hasDuplicateInterviewer: boolean;
  hasDuplicateRole: boolean;
}
