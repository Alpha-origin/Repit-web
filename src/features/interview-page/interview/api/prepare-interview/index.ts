import {
  API_URL,
  ensureAccessToken,
  handleAuthenticationFailure,
} from "@/shared/api/axiosInstance";
import {
  AUTH_REQUIRED_MESSAGE,
  FORBIDDEN_MESSAGE,
} from "@/shared/api/errorMessage";

import {
  getCurrentUserId,
  getErrorMessage,
  getNumericValue,
  getRecord,
  getTrimmedString,
} from "../shared";
import type {
  PrepareInterviewParams,
  PreparedInterviewData,
} from "../type";

const AI_SUBSCRIBE_URL = "/api/v1/ai/subscribe";
const AI_SUBSCRIBE_TIMEOUT_MS = 120_000;
type PrepareInterviewRequestData = PreparedInterviewData;

interface InterviewReadySseData {
  sessionId: string | null;
  interviewId: number | null;
}

const getSseEventName = (eventBlock: string) =>
  eventBlock
    .split(/\r?\n/)
    .find((line) => line.startsWith("event:"))
    ?.slice("event:".length)
    .trim() ?? "message";

const getSseData = (eventBlock: string) =>
  eventBlock
    .split(/\r?\n/)
    .filter((line) => line.startsWith("data:"))
    .map((line) => line.slice("data:".length).replace(/^ /, ""))
    .join("\n");

const getSsePayload = (data: string) => {
  try {
    return getRecord(JSON.parse(data));
  } catch {
    return null;
  }
};

// axios 인터셉터를 타지 않는 요청이라 401/403 응답을 여기서 직접 정리한다.
const getResponseErrorMessage = async (response: Response, fallback: string) => {
  try {
    const payload = getRecord(await response.json());

    return getTrimmedString(payload?.message) ?? fallback;
  } catch {
    return fallback;
  }
};

const throwSubscribeResponseError = async (response: Response) => {
  if (response.status === 401) {
    const errorMessage = await getResponseErrorMessage(
      response,
      AUTH_REQUIRED_MESSAGE,
    );

    handleAuthenticationFailure();
    throw new Error(errorMessage);
  }

  if (response.status === 403) {
    throw new Error(
      await getResponseErrorMessage(response, FORBIDDEN_MESSAGE),
    );
  }

  throw new Error(`AI SSE request failed: ${response.status}`);
};

const getSseErrorMessage = (data: string, fallback: string) => {
  const payload = getSsePayload(data);

  return (
    getTrimmedString(payload?.errorMessage ?? payload?.message) ?? fallback
  );
};

export const waitForInterviewReady = async (
  jobId: string,
  signal?: AbortSignal,
): Promise<InterviewReadySseData> => {
  const baseUrl =
    import.meta.env.MODE === "development" ? window.location.origin : API_URL;
  const subscribeUrl = new URL(
    `${AI_SUBSCRIBE_URL}/${encodeURIComponent(jobId)}`,
    baseUrl,
  );
  const abortController = new AbortController();
  const timeoutId = window.setTimeout(() => {
    abortController.abort();
  }, AI_SUBSCRIBE_TIMEOUT_MS);
  const handleExternalAbort = () => abortController.abort();

  if (signal) {
    if (signal.aborted) {
      abortController.abort();
    } else {
      signal.addEventListener("abort", handleExternalAbort, { once: true });
    }
  }

  try {
    const authorizationHeader = await ensureAccessToken();

    const response = await fetch(subscribeUrl, {
      method: "GET",
      headers: {
        Accept: "text/event-stream",
        Authorization: authorizationHeader,
        "ngrok-skip-browser-warning": "true",
      },
      credentials: "include",
      signal: abortController.signal,
    });

    if (!response.ok) {
      await throwSubscribeResponseError(response);
    }

    if (!response.body) {
      throw new Error("AI SSE response stream is unavailable.");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        throw new Error("AI SSE stream closed before receiving a message.");
      }

      buffer += decoder.decode(value, { stream: true });
      const eventBlocks = buffer.split(/\r?\n\r?\n/);
      buffer = eventBlocks.pop() ?? "";

      for (const eventBlock of eventBlocks) {
        const eventName = getSseEventName(eventBlock);
        const data = getSseData(eventBlock);

        if (!data) {
          continue;
        }

        if (eventName === "interview-ready") {
          const payload = getSsePayload(data);
          const sessionId = getTrimmedString(payload?.sessionId);

          if (!sessionId) {
            throw new Error("준비 완료 이벤트에 면접 세션 정보가 없습니다.");
          }

          await reader.cancel();
          return {
            sessionId,
            interviewId: getNumericValue(payload?.interviewId),
          };
        }

        if (eventName === "question-generated") {
          const payload = getSsePayload(data);
          const errorMessage = getTrimmedString(payload?.error);

          if (errorMessage) {
            throw new Error(errorMessage);
          }

          await reader.cancel();
          return {
            sessionId: getTrimmedString(payload?.sessionId),
            interviewId: getNumericValue(payload?.interviewId),
          };
        }

        if (eventName === "interview-preparation-failed") {
          throw new Error(
            getSseErrorMessage(data, "채팅 면접을 준비하지 못했습니다."),
          );
        }

        if (eventName === "question-generation-failed") {
          throw new Error(
            getSseErrorMessage(data, "면접 질문을 준비하지 못했습니다."),
          );
        }
      }
    }
  } catch (error) {
    const errorMessage =
      error instanceof DOMException && error.name === "AbortError"
        ? "포트폴리오 분석 서버 연결 시간이 초과되었습니다."
        : error instanceof Error
        ? error.message
        : "포트폴리오 분석 상태를 확인하지 못했습니다.";

    throw new Error(errorMessage);
  } finally {
    window.clearTimeout(timeoutId);
    signal?.removeEventListener("abort", handleExternalAbort);
    abortController.abort();
  }
};

const buildPrepareInterviewRequest = (
  params: PrepareInterviewParams,
  sessionId: string,
): PrepareInterviewRequestData => {
  const normalizedQuestions = params.questions.map((question, index) => ({
    questionId: getNumericValue(question.questionId) ?? index + 1,
    intention: question.intention.trim(),
    content: question.content.trim(),
    expectedAnswer: question.expectedAnswer?.trim() ?? "",
    basedOn: question.basedOn ?? [],
    personaId: question.personaId ?? params.personaId,
  }));

  return {
    sessionId,
    interviewId:
      (() => {
        const interviewId = getNumericValue(params.interviewId);
        return interviewId !== null && interviewId > 0 ? interviewId : Date.now();
      })(),
    userId:
      (() => {
        const userId = getNumericValue(params.userId);
        return userId !== null && userId >= 0 ? userId : getCurrentUserId();
      })(),
    personaId: params.personaId,
    personaName: params.personaName,
    role: params.role,
    major: params.major,
    type: params.type,
    personaType: params.personaType,
    level: params.level,
    career: params.career,
    gender: params.gender,
    tone: params.tone,
    jobId: params.jobId.trim(),
    status: "IN_PROGRESS",
    currentQuestionIndex: 0,
    questions: normalizedQuestions,
    mode: "SOLO",
  };
};

export const prepareInterview = async (params: PrepareInterviewParams) => {
  const normalizedSessionId = getTrimmedString(params.sessionId);

  if (!normalizedSessionId) {
    return {
      data: null,
      errorMessage: "면접 세션 정보가 없어 면접을 시작할 수 없습니다.",
    };
  }

  const requestData = buildPrepareInterviewRequest(params, normalizedSessionId);

  try {
    const ready = await waitForInterviewReady(requestData.jobId);
    const preparedInterview: PreparedInterviewData = {
      ...requestData,
      sessionId: ready.sessionId ?? normalizedSessionId,
      interviewId: ready.interviewId ?? requestData.interviewId,
    };

    return {
      data: preparedInterview,
      errorMessage: null,
    };
  } catch (error) {
    return {
      data: null,
      errorMessage: getErrorMessage(error, "면접 준비에 실패했습니다."),
    };
  }
};
