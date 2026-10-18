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
          onBack={setup.onBack}
          onNext={setup.onNext}
        />
      </S.ContentWrapper>
    </S.Container>
  );
};

export default SettingInterviewPage;
