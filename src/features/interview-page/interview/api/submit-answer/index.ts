import { chatInstance } from "@/shared/api/axiosInstance";
import axios from "axios";

import {
  getErrorMessage,
  getInterviewEvent,
  getTrimmedString,
} from "../shared";
import type {
  SubmitInterviewAnswerParams,
  SubmitInterviewAnswerResponse,
} from "../type";

export const submitInterviewAnswer = async ({
  sessionId,
  questionId,
  responseTime,
  content,
}: SubmitInterviewAnswerParams) => {
  const normalizedSessionId = getTrimmedString(sessionId);
  const trimmedContent = content.trim();

  if (!normalizedSessionId) {
    return {
      data: null,
      errorMessage: "답변을 보낼 면접 세션 정보가 없습니다.",
    };
  }

  if (!trimmedContent) {
    return {
      data: null,
      errorMessage: "답변 내용이 비어 있습니다.",
    };
  }

  try {
    const response = await chatInstance.post<SubmitInterviewAnswerResponse>(
      `/chat/interviews/${encodeURIComponent(normalizedSessionId)}/answers`,
      {
        questionId,
        responseTime,
        content: trimmedContent,
      },
    );

    return {
      data: response.data,
      errorMessage: null,
    };
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.data) {
      const fallbackEvent = getInterviewEvent(error.response.data);

      if (fallbackEvent.status) {
        return {
          data: {
            status: fallbackEvent.status,
            question: fallbackEvent.question ?? undefined,
            message: fallbackEvent.message ?? undefined,
          } satisfies SubmitInterviewAnswerResponse,
          errorMessage: null,
        };
      }
    }

    return {
      data: null,
      errorMessage: getErrorMessage(error, "답변 제출에 실패했습니다."),
    };
  }
};
