import { useCallback, useEffect, useState } from "react";
import {
  getLatestPortfolioAnalysis,
  type PortfolioAnalysis,
} from "@/features/my-page/api/portfolioAnalysis";

export const usePortfolioAnalysis = (poll = true) => {
  const [analysis, setAnalysis] = useState<PortfolioAnalysis | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const next = await getLatestPortfolioAnalysis();
      setAnalysis(next);
      setError("");
      return next;
    } catch {
      setError("포트폴리오 분석 상태를 불러오지 못했습니다.");
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    const fetchStatus = async () => {
      try {
        const next = await getLatestPortfolioAnalysis();
        if (active) {
          setAnalysis(next);
          setError("");
        }
      } catch {
        if (active) setError("포트폴리오 분석 상태를 불러오지 못했습니다.");
      } finally {
        if (active) setIsLoading(false);
      }
    };
    void fetchStatus();
    if (!poll) return () => { active = false; };
    const timer = window.setInterval(() => {
      if (active) void fetchStatus();
    }, 7000);
    return () => {
      active = false;
      window.clearInterval(timer);
    };
  }, [poll]);

  return { analysis, error, isLoading, refresh, setAnalysis };
};
