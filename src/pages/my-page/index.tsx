import { useNavigate } from "react-router-dom";

import { useMyInfo } from "@/features/my-page/personal-info/model/useMyInfo";
import { useMaterialsForm } from "@/features/my-page/materials/model/useMaterialsForm";
import { useProfileStatus } from "@/features/profile/model/useProfileStatus";
import ChangeConfirmation from "@/widgets/my-page/portfolio/change-confirmation";
import JobChangeConfirmation from "@/widgets/my-page/portfolio/job-change-confirmation";
import ProfileStatusCard from "@/widgets/my-page/profile-status";
import PersonalInfo from "@/widgets/my-page/personal-info";
import Portfolio from "@/widgets/my-page/portfolio";
import JobSelection from "@/widgets/my-page/job-selection";

import * as S from "./style";

const MyPage = () => {
  const navigate = useNavigate();
  const personalInfo = useMyInfo();
  const profileStatus = useProfileStatus();
  const isAnalyzing = profileStatus.profile?.status === "PENDING";

  const {
    materials,
    jobSelection,
    jobChange,
    isChangeConfirmationOpen,
    onCancelChange,
    onConfirmChange,
    onCancelEdit,
    focusDocuments,
    ...materialsForm
  } = useMaterialsForm({
    isSaveBlocked: profileStatus.isLoading || isAnalyzing || profileStatus.isRestarting,
    requiresChangeConfirmation: profileStatus.profile?.status === "COMPLETED",
    onAnalysisStarted: profileStatus.markPending,
    onAnalysisInvalidated: profileStatus.invalidate,
  });

  const handleReanalyze = async () => {
    materialsForm.clearAnalysisWarning();
    await profileStatus.reanalyze();
  };

  return (
    <S.Page aria-label="마이페이지">
      <S.Content>
        <PersonalInfo {...personalInfo} />
        <Portfolio
          {...materialsForm}
          isAnalyzing={isAnalyzing}
          onReanalyze={() => void handleReanalyze()}
          onBack={() => {
            onCancelEdit();
            navigate("/main");
          }}
          jobSelection={<JobSelection {...jobSelection} />}
        >
          {(materialsForm.isSaving || profileStatus.isRestarting || isAnalyzing ||
            profileStatus.isLoading || profileStatus.errorMessage ||
            profileStatus.profile?.status === "FAILED" || profileStatus.profile?.status === "COMPLETED") && (
            <ProfileStatusCard
              {...profileStatus}
              onRefresh={() => void profileStatus.refetch()}
              onReanalyze={() => void handleReanalyze()}
              onEdit={focusDocuments}
              onReplaceFile={focusDocuments}
              onGoToInterview={() => navigate("/main")}
              isSaving={materialsForm.isSaving}
              jobRole={materials?.jobRole}
            />
          )}
        </Portfolio>
      </S.Content>
      {isChangeConfirmationOpen ? (
        <ChangeConfirmation
          disabled={materialsForm.isSaveDisabled}
          onCancel={onCancelChange}
          onConfirm={() => void onConfirmChange()}
        />
      ) : null}
      {jobChange.isOpen ? (
        <JobChangeConfirmation onCancel={jobChange.onCancel} onConfirm={jobChange.onConfirm} />
      ) : null}
    </S.Page>
  );
};

export default MyPage;
