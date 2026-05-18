import SettingActions from "@/widgets/interview-page/setting-interview/setting-actions";
import SettingContent from "@/widgets/interview-page/setting-interview/setting-content";
import * as S from "@/widgets/interview-page/setting-interview/style";

const SettingInterviewPage = () => {
  return (
    <S.Container>
      <S.ContentWrapper>
        <SettingContent />
        <SettingActions />
      </S.ContentWrapper>
    </S.Container>
  );
};

export default SettingInterviewPage;
