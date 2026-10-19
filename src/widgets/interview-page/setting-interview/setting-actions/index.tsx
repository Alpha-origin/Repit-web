import { INTERVIEW_SETTING_ACTION_LABELS } from '@/shared/constants/interview-page/setting-interview';
import * as S from '../style';
import type { SettingActionsProps } from './type';

const SettingActions = ({
  isBusy,
  isNextDisabled,
  isPortfolioAnalyzing,
  nextLabel = INTERVIEW_SETTING_ACTION_LABELS.next,
  onBack,
  onNext,
}: SettingActionsProps) => (
  <S.BottomButtonWrapper>
    <S.BackButton
      $disabled={isBusy}
      disabled={isBusy}
      type="button"
      onClick={onBack}
    >
      {INTERVIEW_SETTING_ACTION_LABELS.back}
    </S.BackButton>
    <S.NextButton
      $analyzing={isPortfolioAnalyzing}
      $disabled={isNextDisabled}
      disabled={isNextDisabled}
      type="button"
      onClick={onNext}
    >
      {isBusy
        ? '시작 중...'
          : isPortfolioAnalyzing
          ? (
            <>
              분석 중<S.LoadingDots aria-hidden="true" />
            </>
          )
          : nextLabel}
    </S.NextButton>
  </S.BottomButtonWrapper>
);

export default SettingActions;
