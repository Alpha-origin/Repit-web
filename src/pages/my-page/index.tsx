import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getMaterials, type Materials } from "@/features/my-page/api/materials";
import { useMyInfo } from "@/features/my-page/personal-info/model/useMyInfo";
import { useJobSelection } from "@/features/my-page/job-selection/model/useJobSelection";
import { usePortfolioForm } from "@/features/my-page/portfolio/model/usePortfolioForm";
import { useProfileStatus } from "@/features/profile/model/useProfileStatus";
import ChangeConfirmation from "@/widgets/my-page/portfolio/change-confirmation";
import ProfileStatusCard from "@/widgets/my-page/profile-status";
import PersonalInfo from "@/widgets/my-page/personal-info";
import Portfolio from "@/widgets/my-page/portfolio";
import JobSelection from "@/widgets/my-page/job-selection";

import * as S from "./style";

const MyPage = () => {
  const navigate = useNavigate();
  const [materials, setMaterials] = useState<Materials | null>(null);
  // 저장한 뒤 올려서 저장된 자료를 다시 불러온다.
  const [materialsVersion, setMaterialsVersion] = useState(0);
  const personalInfo = useMyInfo();
  const jobSelection = useJobSelection(materials?.jobRole);
  const profileStatus = useProfileStatus();
  const isAnalyzing = profileStatus.profile?.status === "PENDING";

  const initialGitUrls = useMemo(
    () => materials?.gitUrls ?? [],
    [materials?.gitUrls],
  );

  const portfolioForm = usePortfolioForm({
    initialGitUrls,
    jobRole: jobSelection.job,
    isSaveBlocked: profileStatus.isLoading || isAnalyzing || profileStatus.isRestarting,
    requiresChangeConfirmation: profileStatus.profile?.status === "COMPLETED",
    onAnalysisStarted: profileStatus.markPending,
    onUploadSuccess: () => setMaterialsVersion((version) => version + 1),
  });

  useEffect(() => {
    const controller = new AbortController();

    const fetchMaterials = async () => {
      try {
        const nextMaterials = await getMaterials(controller.signal);

        if (!controller.signal.aborted) {
          setMaterials(nextMaterials);
        }
      } catch {
        // 실패하면 이전 값을 그대로 둔다. 저장 직후 다시 불러올 때 화면이 비지 않게 하기 위함이다.
      }
    };

    void fetchMaterials();

    return () => controller.abort();
  }, [materialsVersion]);

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
        <Portfolio
          {...portfolioForm}
          isAnalyzing={isAnalyzing}
          savedDocuments={materials?.documents ?? []}
          onBack={handleBack}
          jobSelection={<JobSelection {...jobSelection} />}
        >
          <ProfileStatusCard
            {...profileStatus}
            onRefresh={() => void profileStatus.refetch()}
            onReanalyze={() => void profileStatus.reanalyze()}
            onEdit={() => portfolioForm.gitInputRef.current?.focus()}
            onReplaceFile={portfolioForm.onPortfolioUploadClick}
            onSave={() => void portfolioForm.onPortfolioSave()}
            onGoToInterview={() => navigate("/main")}
            isSaving={portfolioForm.isSaving}
            jobRole={materials?.jobRole}
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
