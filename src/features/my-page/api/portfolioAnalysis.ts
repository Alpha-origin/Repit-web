import { apiInstance } from "@/shared/api/axiosInstance";

export type PortfolioAnalysisStatus = "NONE" | "PENDING" | "COMPLETED" | "FAILED";

export interface PortfolioAnalysis {
  jobId: string | null;
  status: PortfolioAnalysisStatus;
  errorStatusCode: number | null;
  errorMessage: string | null;
  failureReason: string | null;
  completedAt: string | null;
  projectSummary: {
    overview?: string;
    techStack?: string[];
  } | null;
}

const PROFILE_LATEST_URL = "/api/v1/ai/profile/latest";

export const getLatestPortfolioAnalysis = async () => {
  const response = await apiInstance.get<{ data?: PortfolioAnalysis } | PortfolioAnalysis>(PROFILE_LATEST_URL);
  const payload = response.data;
  return ("data" in payload && payload.data ? payload.data : payload) as PortfolioAnalysis;
};

export const getPortfolioAnalysisFailureMessage = (analysis: PortfolioAnalysis) => {
  switch (analysis.failureReason) {
    case "REPO_NOT_PUBLIC":
      return "GitHub 저장소가 비공개예요. public으로 바꾼 뒤 자료를 다시 저장해주세요.";
    case "INVALID_MATERIAL":
      return "PDF를 열 수 없거나 저장소 주소가 올바르지 않아요. 자료를 바꿔 다시 저장해주세요.";
    case "INSUFFICIENT_EVIDENCE":
      return "코드에서 확인할 내용이 부족해요. 저장소나 포트폴리오를 보강해주세요.";
    default:
      return analysis.errorMessage || "분석 중 문제가 생겼어요. 자료를 확인하고 다시 저장해주세요.";
  }
};
