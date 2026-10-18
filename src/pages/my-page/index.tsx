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
    focusDocuments,
    ...materialsForm
  } = useMaterialsForm({
    isSaveBlocked: profileStatus.isLoading || isAnalyzing || profileStatus.isRestarting,
    requiresChangeConfirmation: profileStatus.profile?.status === "COMPLETED",
    onAnalysisStarted: profileStatus.markPending,
  });

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
          {...materialsForm}
          isAnalyzing={isAnalyzing}
          onReanalyze={() => void profileStatus.reanalyze()}
          jobSelection={<JobSelection {...jobSelection} />}
        >
          <ProfileStatusCard
            {...profileStatus}
            onRefresh={() => void profileStatus.refetch()}
            onReanalyze={() => void profileStatus.reanalyze()}
            onEdit={focusDocuments}
            onReplaceFile={focusDocuments}
            onSave={() => void materialsForm.onSave()}
            onGoToInterview={() => navigate("/main")}
            isSaving={materialsForm.isSaving}
            jobRole={materials?.jobRole}
          />
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
