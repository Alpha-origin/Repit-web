import { INTERVIEW_SETTING_ACTION_LABELS } from "@/shared/constants/interview-page/setting-interview";
import * as S from "../style";

interface SettingActionsProps {
  isNextDisabled: boolean;
  onBack: () => void;
  onNext: () => void;
}

const SettingActions = ({
  isNextDisabled,
  onBack,
  onNext,
}: SettingActionsProps) => {
  return (
    <S.BottomButtonWrapper>
      <S.BackButton type="button" onClick={onBack}>
        {INTERVIEW_SETTING_ACTION_LABELS.back}
      </S.BackButton>
      <S.NextButton
        $disabled={isNextDisabled}
        disabled={isNextDisabled}
        type="button"
        onClick={onNext}
      >
        {INTERVIEW_SETTING_ACTION_LABELS.next}
      </S.NextButton>
    </S.BottomButtonWrapper>
  );
};

export default SettingActions;
