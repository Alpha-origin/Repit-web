import { apiInstance } from "@/shared/api/axiosInstance";

export type AudioAnalysisStatus = "PENDING" | "READY" | "PARTIAL" | "UNAVAILABLE" | "FAILED";
export interface AudioAnalysis {
  status: AudioAnalysisStatus;
  answers: unknown[];
}

export const getAudioAnalysis = async (interviewId: number, signal: AbortSignal): Promise<AudioAnalysis> => {
  const { data } = await apiInstance.get(`/api/interviews/${interviewId}/audio-analysis`, { signal, timeout: 15_000 });
  const result = data?.data;
  if (data?.success !== true || !result ||
    !["PENDING", "READY", "PARTIAL", "UNAVAILABLE", "FAILED"].includes(result.status) ||
    !Array.isArray(result.answers)) throw new Error("음성 분석 정보를 확인하지 못했습니다.");
  return { status: result.status, answers: result.answers };
};
