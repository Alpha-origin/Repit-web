import { apiInstance } from "@/shared/api/axiosInstance";

import { getErrorMessage } from "../shared";
import type { CreateAnswerRequest } from "../type";

interface CreateAnswerResponse {
  success: boolean;
  data?: {
    id: number;
    content: string;
  };
}

const CREATE_ANSWER_URL = "/api/answer";

export const createAnswer = async (payload: CreateAnswerRequest) => {
  try {
    const response = await apiInstance.post<CreateAnswerResponse>(
      CREATE_ANSWER_URL,
      payload,
    );

    if (!response.data.success || !response.data.data) {
      return "답변 제출에 실패했습니다.";
    }

    return null;
  } catch (error) {
    return getErrorMessage(error, "답변 제출에 실패했습니다.");
  }
};
