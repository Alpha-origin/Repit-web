import axios from "axios";

import { apiInstance } from "@/shared/api/axiosInstance";

export interface CreateAnswerRequest {
  id: number;
  content: string;
}

interface CreateAnswerResponse {
  success: boolean;
  data?: {
    id: number;
    content: string;
  };
}

interface ErrorResponse {
  message?: string;
  error?: string;
}

const CREATE_ANSWER_URL = "/api/answer";

const getErrorMessage = (error: unknown, fallback: string) => {
  if (axios.isAxiosError(error)) {
    if (!error.response) {
      return "서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.";
    }

    const data = error.response.data as ErrorResponse | undefined;

    if (data?.message) return data.message;
    if (data?.error) return data.error;
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
};

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
