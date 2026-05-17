import { INTERVIEW_SETTING_ACTION_LABELS } from '@/shared/constants/interview-page/setting-interview';
import * as S from '../style';

const SettingActions = () => {
  return (
    <S.BottomButtonWrapper>
      <S.BackButton type="button">{INTERVIEW_SETTING_ACTION_LABELS.back}</S.BackButton>
      <S.NextButton type="button">{INTERVIEW_SETTING_ACTION_LABELS.next}</S.NextButton>
    </S.BottomButtonWrapper>
  );
};

export default SettingActions;
