import { useLocation, useNavigate } from "react-router-dom";

import * as S from "./style";

const getAnsweredQuestionCount = (state: unknown) => {
  if (!state || typeof state !== "object") {
    return null;
  }

  const record = state as { answeredQuestionCount?: unknown };
  return typeof record.answeredQuestionCount === "number" &&
    Number.isFinite(record.answeredQuestionCount) &&
    record.answeredQuestionCount > 0
    ? Math.trunc(record.answeredQuestionCount)
    : null;
};

const InterviewCompletedContent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const answeredQuestionCount = getAnsweredQuestionCount(location.state);

  return (
    <S.Card>
      <S.Badge>Interview Complete</S.Badge>
      <S.Title>면접이 종료되었습니다.</S.Title>
      <S.Description>
        {answeredQuestionCount
          ? `${answeredQuestionCount}개의 질문에 답변했고 면접이 정상적으로 마무리되었어요.`
          : "면접이 정상적으로 마무리되었어요."}
      </S.Description>

      <S.ActionRow>
        <S.SecondaryButton type="button" onClick={() => navigate("/main")}>
          메인으로
        </S.SecondaryButton>
        <S.PrimaryButton
          type="button"
          onClick={() => navigate("/main/feedback/list")}
        >
          피드백 보러가기
        </S.PrimaryButton>
      </S.ActionRow>
    </S.Card>
  );
};

export default InterviewCompletedContent;
