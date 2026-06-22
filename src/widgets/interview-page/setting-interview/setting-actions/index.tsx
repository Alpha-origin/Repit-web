import { INTERVIEW_SETTING_ACTION_LABELS } from "@/shared/constants/interview-page/setting-interview";
import * as S from "../style";

interface SettingActionsProps {
  isBusy?: boolean;
  isNextDisabled: boolean;
  nextLabel?: string;
  onBack: () => void;
  onNext: () => void;
}

const SettingActions = ({
  isBusy = false,
  isNextDisabled,
  nextLabel,
  onBack,
  onNext,
}: SettingActionsProps) => {
  return (
    <S.BottomButtonWrapper>
      <S.BackButton $disabled={isBusy} disabled={isBusy} type="button" onClick={onBack}>
        {INTERVIEW_SETTING_ACTION_LABELS.back}
      </S.BackButton>
      <S.NextButton
        $disabled={isNextDisabled}
        disabled={isNextDisabled}
        type="button"
        onClick={onNext}
      >
        {nextLabel ?? INTERVIEW_SETTING_ACTION_LABELS.next}
      </S.NextButton>
    </S.BottomButtonWrapper>
  );
};

export default SettingActions;
