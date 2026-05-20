import { INTERVIEW_SETTING_ACTION_LABELS } from "@/shared/constants/interview-page/setting-interview";
import { useNavigate } from "react-router-dom";
import * as S from "../style";

const SettingActions = () => {
  const navigate = useNavigate();

  return (
    <S.BottomButtonWrapper>
      <S.BackButton type="button" onClick={() => navigate(-1)}>
        {INTERVIEW_SETTING_ACTION_LABELS.back}
      </S.BackButton>
      <S.NextButton type="button" onClick={() => navigate("/main/interview")}>
        {INTERVIEW_SETTING_ACTION_LABELS.next}
      </S.NextButton>
    </S.BottomButtonWrapper>
  );
};

export default SettingActions;
