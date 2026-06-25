import { useInterviewSetup } from "@/features/interview-page/setting-interview/model/useInterviewSetup";
import SettingActions from "@/widgets/interview-page/setting-interview/setting-actions";
import SettingContent from "@/widgets/interview-page/setting-interview/setting-content";
import * as S from "@/widgets/interview-page/setting-interview/style";

const SettingInterviewScreen = () => {
  const setup = useInterviewSetup();

  return (
    <S.Container>
      <S.ContentWrapper>
        <SettingContent
          onDifficultySelect={setup.onDifficultySelect}
          onInterviewerSelect={setup.onInterviewerSelect}
          onStyleSelect={setup.onStyleSelect}
          selectedDifficulty={setup.selectedDifficulty}
          selectedInterviewerId={setup.selectedInterviewerId}
          selectedStyle={setup.selectedStyle}
        />
        {setup.errorMessage ? (
          <S.ErrorMessage role="alert">{setup.errorMessage}</S.ErrorMessage>
        ) : null}
        <SettingActions
          isBusy={setup.isSubmitting}
          isNextDisabled={!setup.isSelectionComplete || setup.isSubmitting}
          nextLabel={setup.isSubmitting ? "시작 중..." : undefined}
          onBack={setup.onBack}
          onNext={setup.onNext}
        />
      </S.ContentWrapper>
    </S.Container>
  );
};

export default SettingInterviewScreen;
