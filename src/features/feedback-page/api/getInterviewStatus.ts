import { apiInstance } from "@/shared/api/axiosInstance";

const GET_INTERVIEW_URL = "/api/interviews/get";

const readStatus = (value: unknown) => {
  if (!value || typeof value !== "object") {
    return null;
  }

  const { status } = value as { status?: unknown };
  return typeof status === "string" ? status : null;
};

export const getInterviewStatus = async (
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

  return readStatus(payload?.data) ?? readStatus(payload);
};
