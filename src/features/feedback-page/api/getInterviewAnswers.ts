import { apiInstance } from "@/shared/api/axiosInstance";
import { extractErrorMessage } from "@/shared/api/errorMessage";

export interface InterviewAnswer {
  answerId: number;
  interview: number;
  question: number;
  userId: number;
  responseTime: number;
  content: string;
  createdAt: string;
}

interface InterviewAnswersResponse {
  success: boolean;
  data?: InterviewAnswer[];
}

export const getInterviewAnswers = async (interviewId: number) => {
  if (!Number.isSafeInteger(interviewId) || interviewId <= 0) {
    throw new Error("답변을 조회할 면접 정보가 없습니다.");
  }

  const response = await apiInstance.get<InterviewAnswersResponse>(
    "/api/answer/getAll",
    { params: { interviewId } },
  );

  if (!response.data.success || !Array.isArray(response.data.data)) {
    throw new Error(
      extractErrorMessage(response.data, "면접 답변을 불러오지 못했습니다."),
    );
  }

  return response.data.data.filter((answer) => answer.interview === interviewId);
};
