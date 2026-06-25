import { chatInstance } from "@/shared/api/axiosInstance";

import { getErrorMessage, getTrimmedString } from "../shared";
import type { CompleteInterviewResponse } from "../type";

export const completeInterview = async (sessionId: string) => {
  const normalizedSessionId = getTrimmedString(sessionId);

  if (!normalizedSessionId) {
    return {
      data: null,
      errorMessage: "완료할 면접 세션 정보가 없습니다.",
    };
  }

  try {
    const response = await chatInstance.post<CompleteInterviewResponse>(
      `/chat/interviews/${encodeURIComponent(normalizedSessionId)}/complete`,
    );

    return {
      data: response.data,
      errorMessage: null,
    };
  } catch (error) {
    return {
      data: null,
      errorMessage: getErrorMessage(error, "면접 완료에 실패했습니다."),
    };
  }
};
