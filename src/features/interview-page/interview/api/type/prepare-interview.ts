export type PersonaType = "FRIENDLY" | "NORMAL" | "PRESSURE";
export type InterviewProgressStatus = "IN_PROGRESS" | "COMPLETED" | "READY";

export interface PrepareInterviewQuestion {
  questionId: number;
  intention: string;
  content: string;
}

export interface PrepareInterviewParams {
  sessionId?: string;
  interviewId?: number;
  userId?: number;
  personaId: number;
  personaType: PersonaType;
  questions: PrepareInterviewQuestion[];
}

export interface PreparedInterviewData {
  sessionId: string;
  interviewId: number;
  userId: number;
  personaId: number;
  personaType: PersonaType;
  status: InterviewProgressStatus;
  currentQuestionIndex: number;
  questions: PrepareInterviewQuestion[];
}
