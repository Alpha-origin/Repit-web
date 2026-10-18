import type { JobRoleCode } from "@/shared/constants/job/jobRoles";
import type { PrepareInterviewQuestion } from "./prepare-interview";

export type InterviewPersonaMajor = JobRoleCode;
export type InterviewPersonality =
  | "FRIENDLY"
  | "REALISTIC"
  | "METICULOUS";
export type CreateInterviewPersonaType = InterviewPersonality;
export type InterviewPersonaGender = "MALE" | "FEMALE";
export type InterviewPersonaRole = "TECH" | "HR" | "CEO" | "PM" | "DESIGN";
export type InterviewTone = "GENTLE" | "DIRECT" | "PRESSURING";
export type InterviewMode = "SOLO" | "MULTI";
export type InterviewLifecycleStatus =
  | "IN_PROGRESS"
  | "COMPLETED"
  | "ABANDONED";

export interface CreateSoloInterviewParams {
  personaName: string;
  major?: InterviewPersonaMajor;
  type: CreateInterviewPersonaType;
  career: number;
  gender: InterviewPersonaGender;
}

export interface CreateMultiInterviewParams {
  personaIds: number[];
}

export type CreateInterviewParams =
  | CreateSoloInterviewParams
  | CreateMultiInterviewParams;

export interface CreatedInterviewData {
  interviewId: number;
  userId: number;
  mode: InterviewMode;
  personaId: number | null;
  personaIds: number[];
  sessionId: string;
  status: InterviewLifecycleStatus;
  createdAt: string | null;
  currentQuestionIndex: number;
  questions: PrepareInterviewQuestion[];
}
