export interface SubmitInterviewAnswerParams {
  sessionId: string;
  questionId: number;
  responseTime: number;
  content: string;
}

export interface SubmitInterviewAnswerQuestion {
  questionId: number;
  parentId: number;
  type: string;
  intention: string;
  content: string;
}

export interface SubmitInterviewAnswerResponse {
  status: string;
  question?: SubmitInterviewAnswerQuestion;
  message?: string;
}
