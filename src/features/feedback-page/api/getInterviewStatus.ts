import { apiInstance } from "@/shared/api/axiosInstance";

const GET_INTERVIEW_URL = "/api/interviews/get";

interface InterviewState {
  status: string;
  answerMode: "TEXT" | "VOICE" | null;
}

const readInterviewState = (value: unknown): InterviewState | null => {
  if (!value || typeof value !== "object") {
    return null;
  }

  const { status, answerMode } = value as { status?: unknown; answerMode?: unknown };
  if (typeof status !== "string") return null;
  return {
    status,
    // API #120은 답변 방식이 null인 이전 면접을 음성 면접으로 취급한다.
    answerMode: answerMode === null ? "VOICE"
      : answerMode === "TEXT" || answerMode === "VOICE" ? answerMode : null,
  };
};

export const getInterviewState = async (
  interviewId: number,
  { signal, timeout }: { signal?: AbortSignal; timeout?: number } = {},
) => {
  if (!Number.isSafeInteger(interviewId) || interviewId <= 0) {
    throw new Error("조회할 면접 정보가 없습니다.");
  }

  const response = await apiInstance.get<unknown>(GET_INTERVIEW_URL, {
    params: { interviewId },
    signal,
    timeout,
  });
  const payload = response.data as { data?: unknown } | null;

  return readInterviewState(payload?.data) ?? readInterviewState(payload);
};

export const getInterviewStatus = async (
  interviewId: number,
  options: { signal?: AbortSignal; timeout?: number } = {},
) => (await getInterviewState(interviewId, options))?.status ?? null;
