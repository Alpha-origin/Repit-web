import { useEffect, useState } from "react";
import { getMyPageMetaData } from "@/features/my-page/api/getMyPageData";
import { getLatestPortfolioAnalysis, getPortfolioAnalysisFailureMessage, type PortfolioAnalysis } from "@/features/my-page/api/portfolioAnalysis";

export const usePortfolioInterviewGate = () => {
  const [analysis, setAnalysis] = useState<PortfolioAnalysis | null>(null);
  const [hasPortfolio, setHasPortfolio] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const refresh = async () => {
      const [analysisResult, metaResult] = await Promise.allSettled([
        getLatestPortfolioAnalysis(), getMyPageMetaData(),
      ]);
      if (!active) return;
      if (analysisResult.status === "fulfilled") setAnalysis(analysisResult.value);
      if (metaResult.status === "fulfilled") {
        setHasPortfolio(Boolean(metaResult.value.fileUrl?.trim() && metaResult.value.gitUrls?.length));
      }
      setLoading(false);
    };
    void refresh();
    const timer = window.setInterval(() => void refresh(), 7000);
    return () => { active = false; window.clearInterval(timer); };
  }, []);

  const isPortfolioAnalyzing = analysis?.status === "PENDING";
  const isBlocked = loading || isPortfolioAnalyzing || (analysis?.status === "NONE" && hasPortfolio === false);
  const message = loading
    ? "포트폴리오 상태를 확인하고 있어요."
    : isPortfolioAnalyzing
      ? "포트폴리오를 분석하고 있어요. 완료되면 면접을 시작할 수 있어요."
      : analysis?.status === "NONE" && hasPortfolio === false
        ? "마이페이지에서 포트폴리오를 먼저 등록해주세요."
        : analysis?.status === "FAILED"
          ? getPortfolioAnalysisFailureMessage(analysis)
          : analysis?.status === "NONE" && hasPortfolio
            ? "첫 면접은 포트폴리오 분석부터 진행해 몇 분 더 걸릴 수 있어요."
            : "";

  return { isPortfolioAnalyzing, isBlocked, message, requiresPortfolio: analysis?.status === "NONE" && hasPortfolio === false };
};
