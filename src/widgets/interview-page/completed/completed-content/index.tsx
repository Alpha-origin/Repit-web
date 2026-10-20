import { useLocation, useNavigate } from "react-router-dom";
import completionIcon from "@/shared/img/interview-page/end.svg?url";

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

const getCompletedInterviewId = (state: unknown) => {
  if (!state || typeof state !== "object") {
    return null;
  }

  const { interviewId } = state as { interviewId?: unknown };
  return typeof interviewId === "number" &&
    Number.isSafeInteger(interviewId) &&
    interviewId > 0
    ? interviewId
    : null;
};

const InterviewCompletedContent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const answeredQuestionCount = getAnsweredQuestionCount(location.state);
  const interviewId = getCompletedInterviewId(location.state);

  const handleOpenFeedback = () => {
    if (interviewId === null) {
      navigate("/main/feedback/list");
      return;
    }

    navigate(`/main/feedback/overall/${interviewId}`, {
      state: { fromCompletion: true },
    });
  };

  return (
    <S.Content>
      <S.CompletionIcon src={completionIcon} alt="" aria-hidden="true" />
      <S.Title>면접이 종료되었습니다.</S.Title>
      <S.Description>
        {answeredQuestionCount
          ? `${answeredQuestionCount}개의 질문에 답변했고 면접이 정상적으로 마무리 되었습니다.`
          : "면접이 정상적으로 마무리 되었습니다."}
      </S.Description>

      <S.ActionRow>
        <S.SecondaryButton type="button" onClick={() => navigate("/main")}>
          메인으로 돌아가기
        </S.SecondaryButton>
        <S.PrimaryButton
          type="button"
          onClick={handleOpenFeedback}
        >
          피드백 보러가기
        </S.PrimaryButton>
      </S.ActionRow>
    </S.Content>
  );
};

export default InterviewCompletedContent;
