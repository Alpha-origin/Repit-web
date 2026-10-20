import { apiInstance } from "@/shared/api/axiosInstance";
import { parseVideoAnalysis } from "../model/validateVideoAnalysis";

export const retryVideoAnalysis = async (interviewId: number, signal: AbortSignal) => {
  const { data } = await apiInstance.post<unknown>(`/api/interviews/${interviewId}/video-analysis/retry`, undefined, { signal, timeout: 15_000 });
  return parseVideoAnalysis(data);
};
