import { apiInstance } from "@/shared/api/axiosInstance";
import { parseVideoAnalysis } from "../model/validateVideoAnalysis";

export const getVideoAnalysis = async (interviewId: number, signal: AbortSignal) => {
  const { data } = await apiInstance.get<unknown>(`/api/interviews/${interviewId}/video-analysis`, { signal, timeout: 15_000 });
  return parseVideoAnalysis(data);
};
