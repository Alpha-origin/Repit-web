export type QuestionAudioServerStatus = "READY" | "PENDING" | "FAILED";

export interface QuestionAudioResponse {
  questionId: number;
  status: QuestionAudioServerStatus;
  url: string | null;
  errorCode: string | null;
}
