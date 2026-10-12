import { apiInstance } from "@/shared/api/axiosInstance";

export type ProfileStatus = "NONE" | "PENDING" | "COMPLETED" | "FAILED";
export type ProfileFailureReason =
  | "REPO_NOT_PUBLIC"
  | "INVALID_MATERIAL"
  | "INSUFFICIENT_EVIDENCE"
  | "INTERNAL";

export interface LatestProfile {
  jobId: string | null;
  status: ProfileStatus;
  errorStatusCode: number | null;
  errorMessage: string | null;
  failureReason: ProfileFailureReason | null;
  completedAt: string | null;
  projectSummary: unknown;
}

export const getLatestProfile = async (signal?: AbortSignal) => {
  const response = await apiInstance.get<{ success: boolean; data: LatestProfile }>(
    "/api/v1/ai/profile/latest",
    { signal, timeout: 15_000 },
  );
  const profile = response.data.data;
  if (
    !response.data.success || !profile ||
    !["NONE", "PENDING", "COMPLETED", "FAILED"].includes(profile.status)
  ) {
    throw new Error("자료 분석 상태를 확인하지 못했습니다.");
  }
  return profile;
};

export const generateProfile = async (signal?: AbortSignal) => {
  const response = await apiInstance.post<{
    success?: boolean;
    message?: string;
    jobId?: string;
    data?: { jobId?: string };
  }>(
    "/api/v1/ai/generate",
    undefined,
    { signal },
  );
  if (response.data.success === false) {
    throw new Error(response.data.message || "자료 분석을 다시 요청하지 못했습니다.");
  }
  return response.data.data?.jobId ?? response.data.jobId ?? null;
};
