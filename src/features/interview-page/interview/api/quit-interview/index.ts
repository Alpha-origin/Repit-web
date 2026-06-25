import { chatInstance } from "@/shared/api/axiosInstance";

import { getErrorMessage, getTrimmedString } from "../shared";
import type { QuitInterviewResponse } from "../type";

export const quitInterview = async (sessionId: string) => {
  const normalizedSessionId = getTrimmedString(sessionId);

  if (!normalizedSessionId) {
    return {
      data: null,
      errorMessage: "종료할 면접 세션 정보가 없습니다.",
    };
  }

  try {
    const response = await chatInstance.post<QuitInterviewResponse>(
      `/chat/interviews/${encodeURIComponent(normalizedSessionId)}/quit`,
    );

    return {
      data: response.data,
      errorMessage: null,
    };
  } catch (error) {
    return {
      data: null,
      errorMessage: getErrorMessage(error, "면접 종료에 실패했습니다."),
    };
  }
};
