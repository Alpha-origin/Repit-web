import { useParams } from "react-router-dom";
import * as S from "./style";

const FeedbackTabs = () => {
  const { id } = useParams();

  return (
    <S.TabGroup aria-label="피드백 종류">
      <S.TabLink to={`/main/feedback/overall/${id}`} end>종합 피드백</S.TabLink>
      <S.TabLink to={`/main/feedback/detail/${id}`} end>상세 피드백</S.TabLink>
    </S.TabGroup>
  );
};

export default FeedbackTabs;
