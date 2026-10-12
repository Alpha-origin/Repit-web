import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getMyPageMetaData,
  type MyPageMetaData,
} from "@/features/my-page/api/getMyPageData";
import { useMyInfo } from "@/features/my-page/personal-info/model/useMyInfo";
import { usePortfolioForm } from "@/features/my-page/portfolio/model/usePortfolioForm";
import { usePortfolioAnalysis } from "@/features/my-page/portfolio/model/usePortfolioAnalysis";
import type { PortfolioAnalysis } from "@/features/my-page/api/portfolioAnalysis";
import PersonalInfo from "@/widgets/my-page/personal-info";
import Portfolio from "@/widgets/my-page/portfolio";

import * as S from "./style";

const MyPage = () => {
  const navigate = useNavigate();
  const [metaData, setMetaData] = useState<MyPageMetaData | null>(null);
  const personalInfo = useMyInfo();
  const portfolioAnalysis = usePortfolioAnalysis();

  const initialGitUrls = useMemo(
    () => metaData?.gitUrls ?? [],
    [metaData?.gitUrls],
  );
  const portfolioForm = usePortfolioForm({
    initialGitUrls,
    initialJobRole: metaData?.jobRole,
    onUploadSuccess: (nextMetaData) => {
      setMetaData(nextMetaData);
      portfolioAnalysis.setAnalysis({ jobId: null, status: "PENDING", errorStatusCode: null, errorMessage: null, failureReason: null, completedAt: null, projectSummary: null } satisfies PortfolioAnalysis);
    },
  });

  useEffect(() => {
    let isActive = true;

    const fetchMetaData = async () => {
      try {
        const nextMetaData = await getMyPageMetaData();

        if (isActive) {
          setMetaData(nextMetaData);
        }
      } catch {
        if (isActive) {
          setMetaData(null);
        }
      }
    };

    void fetchMetaData();

    return () => {
      isActive = false;
    };
  }, []);

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }

    navigate("/main");
  };

  return (
    <S.Page>
      <PersonalInfo {...personalInfo} />
      <Portfolio {...portfolioForm} analysis={portfolioAnalysis.analysis} analysisError={portfolioAnalysis.error} onBack={handleBack} />
    </S.Page>
  );
};

export default MyPage;
