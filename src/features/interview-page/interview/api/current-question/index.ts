import { chatInstance } from "@/shared/api/axiosInstance";

import { getErrorMessage, getInterviewQuestion, getTrimmedString } from "../shared";
import type { CurrentInterviewQuestion } from "../type";

export const getCurrentInterviewQuestion = async (sessionId: string) => {
  const normalizedSessionId = getTrimmedString(sessionId);

  if (!normalizedSessionId) {
    return {
      data: null,
      errorMessage: "질문을 가져올 면접 세션 정보가 없습니다.",
    };
  }

  try {
    const response = await chatInstance.get<CurrentInterviewQuestion>(
      `/chat/interviews/${encodeURIComponent(normalizedSessionId)}/question`,
    );
    const currentQuestion = getInterviewQuestion(response.data);

    if (!currentQuestion) {
      return {
        data: null,
        errorMessage: "현재 질문을 불러오지 못했습니다.",
      };
    }

    return {
      data: currentQuestion,
      errorMessage: null,
    };
  } catch (error) {
    return {
      data: null,
      errorMessage: getErrorMessage(error, "현재 질문을 불러오지 못했습니다."),
    };
  }
};
