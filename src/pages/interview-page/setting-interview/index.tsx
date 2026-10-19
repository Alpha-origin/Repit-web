import { Navigate, useLocation } from "react-router-dom";
import { COMPANY_SETTING_PATH } from "@/features/interview-page/setting-company/model/draft";
import { loadSetupDraft } from "@/features/interview-page/setting-company/model/draftStore";
import { useUserStore } from "@/shared/store/userStore";
import Loading from "@/shared/components/loading";
import PersonaOptions from "@/widgets/interview-page/setting-interview/persona-options";
import ProfileGuidance from "@/widgets/interview-page/profile-guidance";
import { useInterviewSetup } from "@/features/interview-page/setting-interview/model/useInterviewSetup";
import AnswerModeOptions from "@/widgets/interview-page/setting-interview/answer-mode-options";
import InterviewerOptions from "@/widgets/interview-page/setting-interview/interviewer-options";
import SettingActions from "@/widgets/interview-page/setting-interview/setting-actions";
import SettingOptions from "@/widgets/interview-page/setting-interview/setting-options";
import * as S from "@/widgets/interview-page/setting-interview/style";

const SettingInterviewPage = () => {
  const setup = useInterviewSetup();

  return (
    <S.Container>
      <S.ContentWrapper>
        <S.Sections>
          <SettingOptions
            onSelect={setup.select}
            selection={setup.selection}
          >
            <AnswerModeOptions
              answerMode={setup.answerMode}
              onAnswerModeChange={setup.onAnswerModeChange}
            />
          </SettingOptions>
          <S.ControlColumn>
            <PersonaOptions
              personality={setup.selection.personality}
              tone={setup.selection.tone}
              onPersonalityChange={setup.select.personality}
              onToneChange={setup.select.tone}
            />
            <InterviewerOptions
              onSelect={setup.select.interviewer}
              selectedValue={setup.selection.interviewerKey}
            />
          </S.ControlColumn>
        </S.Sections>
        {setup.profileGuidance || setup.showMyPageLink || setup.onRefreshProfile ? (
          <ProfileGuidance
            message={setup.profileGuidance}
            showMyPageLink={setup.showMyPageLink}
            onRetry={setup.onRefreshProfile}
          />
        ) : null}
        <SettingActions
          isBusy={false}
          isNextDisabled={setup.isNextDisabled}
          isPortfolioAnalyzing={setup.isPortfolioAnalyzing}
          nextLabel="다음: 기업 선택"
          onBack={setup.onBack}
          onNext={setup.onNext}
        />
      </S.ContentWrapper>
    </S.Container>
  );
};

const AuthenticatedSettings = () => {
  const { isLoaded, id } = useUserStore();
  const location = useLocation();
  const saved = isLoaded ? loadSetupDraft(new URLSearchParams(location.search).get("draftId")) : null;
  if (saved?.submission) return <Navigate to={`${COMPANY_SETTING_PATH}?draftId=${saved.draftId}`} replace />;
  return isLoaded ? <SettingInterviewPage key={id} /> : <Loading message="로그인 정보를 확인하고 있어요" />;
};

export default AuthenticatedSettings;
