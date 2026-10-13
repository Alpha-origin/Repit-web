import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getMyPageMetaData,
  type MyPageMetaData,
} from "@/features/my-page/api/getMyPageData";
import { useMyInfo } from "@/features/my-page/personal-info/model/useMyInfo";
import { usePortfolioForm } from "@/features/my-page/portfolio/model/usePortfolioForm";
import { useProfileStatus } from "@/features/profile/model/useProfileStatus";
import ChangeConfirmation from "@/widgets/my-page/portfolio/change-confirmation";
import ProfileStatusCard from "@/widgets/my-page/profile-status";
import PersonalInfo from "@/widgets/my-page/personal-info";
import Portfolio from "@/widgets/my-page/portfolio";

import * as S from "./style";

const MyPage = () => {
  const navigate = useNavigate();
  const [metaData, setMetaData] = useState<MyPageMetaData | null>(null);
  const personalInfo = useMyInfo();
  const profileStatus = useProfileStatus();
  const isAnalyzing = profileStatus.profile?.status === "PENDING";

  const initialGitUrls = useMemo(
    () => metaData?.gitUrls ?? [],
    [metaData?.gitUrls],
  );
  const portfolioForm = usePortfolioForm({
    initialGitUrls,
    isSaveBlocked: profileStatus.isLoading || isAnalyzing || profileStatus.isRestarting,
    requiresChangeConfirmation: profileStatus.profile?.status === "COMPLETED",
    onAnalysisStarted: profileStatus.markPending,
    onUploadSuccess: setMetaData,
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
      <S.PageHeader>
        <S.PageTitle>마이페이지</S.PageTitle>
        <S.PageDescription>
          나의 정보와 경험을 채우고, 나에게 맞는 면접을 준비하세요.
        </S.PageDescription>
      </S.PageHeader>
      <S.Content>
        <PersonalInfo {...personalInfo} />
        <Portfolio {...portfolioForm} isAnalyzing={isAnalyzing} onBack={handleBack}>
          <ProfileStatusCard
            {...profileStatus}
            onRefresh={() => void profileStatus.refetch()}
            onReanalyze={() => void profileStatus.reanalyze()}
            onEdit={() => portfolioForm.gitInputRef.current?.focus()}
            onReplaceFile={portfolioForm.onPortfolioUploadClick}
            onSave={() => void portfolioForm.onPortfolioSave()}
            isSaving={portfolioForm.isSaving}
          />
        </Portfolio>
      </S.Content>
      {portfolioForm.isChangeConfirmationOpen ? (
        <ChangeConfirmation
          disabled={portfolioForm.isSaveDisabled}
          onCancel={portfolioForm.onCancelChange}
          onConfirm={() => void portfolioForm.onConfirmChange()}
        />
      ) : null}
    </S.Page>
  );
};

export default MyPage;
