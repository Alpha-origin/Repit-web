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
            <PersonaOptions
              personality={setup.selection.personality}
              tone={setup.selection.tone}
              onPersonalityChange={setup.select.personality}
              onToneChange={setup.select.tone}
            />
          </SettingOptions>
          <InterviewerOptions
            onSelect={setup.select.interviewer}
            selectedValue={setup.selection.interviewerKey}
          />
        </S.Sections>
        <AnswerModeOptions
          answerMode={setup.answerMode}
          onAnswerModeChange={setup.onAnswerModeChange}
        />
        {setup.profileGuidance || setup.showMyPageLink || setup.onRefreshProfile ? (
          <ProfileGuidance
            message={setup.profileGuidance}
            showMyPageLink={setup.showMyPageLink}
            onRetry={setup.onRefreshProfile}
          />
        ) : null}
        {setup.errorMessage ? (
          <S.ErrorMessage role="alert">{setup.errorMessage}</S.ErrorMessage>
        ) : null}
        <SettingActions
          isBusy={setup.isSubmitting}
          isNextDisabled={setup.isNextDisabled}
          isPortfolioAnalyzing={setup.isPortfolioAnalyzing}
          onBack={setup.onBack}
          onNext={setup.onNext}
        />
      </S.ContentWrapper>
      {setup.isSubmitting ? (
        <S.LoadingOverlay role="status" aria-live="polite">
          <S.LoadingSpinner aria-hidden="true" />
          <S.LoadingMessage>면접을 준비하고 있어요</S.LoadingMessage>
        </S.LoadingOverlay>
      ) : null}
    </S.Container>
  );
};

export default SettingInterviewPage;
