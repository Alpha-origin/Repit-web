import { useInterviewSetup } from "@/features/interview-page/setting-interview/model/useInterviewSetup";
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
          />
          <InterviewerOptions
            onSelect={setup.select.interviewer}
            selectedValue={setup.selection.interviewerId}
          />
        </S.Sections>
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
          <S.LoadingMessage>질문 생성중입니다</S.LoadingMessage>
        </S.LoadingOverlay>
      ) : null}
    </S.Container>
  );
};

export default SettingInterviewPage;
