import type { PrepareInterviewQuestion } from "./prepare-interview";

export interface GetInterviewQuestionsParams {
  interviewId: number;
}

export type InterviewOriginalQuestion = PrepareInterviewQuestion;
