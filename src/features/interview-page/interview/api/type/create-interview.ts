export type InterviewPersonaMajor = "BACKEND" | "FRONTEND";
export type CreateInterviewPersonaType = "FRIENDLY" | "NEUTRAL" | "STRESS";
export type InterviewPersonaGender = "MALE" | "FEMALE";
export type InterviewLifecycleStatus =
  | "IN_PROGRESS"
  | "COMPLETED"
  | "ABANDONED";

export interface CreateInterviewParams {
  personaName: string;
  major: InterviewPersonaMajor;
  type: CreateInterviewPersonaType;
  career: number;
  gender: InterviewPersonaGender;
}

export interface CreatedInterviewData {
  interviewId: number;
  userId: number;
  personaId: number;
  sessionId: string;
  status: InterviewLifecycleStatus;
  createdAt: string | null;
}
