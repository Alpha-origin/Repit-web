import axios from "axios";
import { chatInstance } from "@/shared/api/axiosInstance";
import { getErrorMessage, getQuestionAudioResponse } from "../shared";
import type { QuestionAudioResponse } from "../type";

export type GetQuestionAudioResult =
  | { data: QuestionAudioResponse; errorMessage: null }
  | { data: null; errorMessage: null; aborted: true }
  | { data: null; errorMessage: null; notFound: true }
  | { data: null; errorMessage: string };

export const getQuestionAudio = async ({ sessionId, questionId, signal }: {
  sessionId: string;
  questionId: number;
  signal?: AbortSignal;
}): Promise<GetQuestionAudioResult> => {
  try {
    const response = await chatInstance.get(
      `/chat/interviews/${encodeURIComponent(sessionId)}/questions/${questionId}/audio`,
      { params: { wait: 20 }, signal, timeout: 30_000 },
    );
    const data = getQuestionAudioResponse(response.data);
    if (!data || data.questionId !== questionId) {
      return { data: null, errorMessage: "질문 음성 응답 형식이 올바르지 않습니다." };
    }
    return { data, errorMessage: null };
  } catch (error) {
    if (axios.isCancel(error)) return { data: null, errorMessage: null, aborted: true };
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return { data: null, errorMessage: null, notFound: true };
    }
    return { data: null, errorMessage: getErrorMessage(error, "질문 음성을 조회하지 못했습니다.") };
  }
};
