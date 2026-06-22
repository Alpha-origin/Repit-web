export interface QuitInterviewQuestion {
  questionId: number;
  parentId: number;
  type: string;
  intention: string;
  content: string;
}

export interface QuitInterviewResponse {
  status: string;
  question?: QuitInterviewQuestion;
  message?: string;
}
