export interface CompleteInterviewQuestion {
  questionId: number;
  parentId: number;
  type: string;
  intention: string;
  content: string;
}

export interface CompleteInterviewResponse {
  status: string;
  question?: CompleteInterviewQuestion;
  message?: string;
}
