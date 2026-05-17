import * as S from './style';
import SettingActions from './setting-actions';
import SettingContent from './setting-content';

const SettingInterview = () => {
  return (
    <S.Container>
      <S.ContentWrapper>
        <SettingContent />
        <SettingActions />
      </S.ContentWrapper>
    </S.Container>
  );
};

export default SettingInterview;
