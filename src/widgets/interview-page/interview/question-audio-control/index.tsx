import { useInterviewSessionContext } from "@/features/interview-page/interview/model/useInterviewSessionContext";
import * as S from "./style";

const QuestionAudioControl = () => {
  const interview = useInterviewSessionContext();
  const status = interview.questionAudioStatus;
  return (
    <S.Button
      type="button"
      disabled={interview.currentQuestion === null || status === "loading" || status === "failed"}
      aria-pressed={status === "playing"}
      onClick={interview.onToggleQuestionAudio}
    >
      {status === "loading" ? "음성 생성 중..." : status === "playing" ? "질문 멈추기" : "질문 듣기"}
    </S.Button>
  );
};

export const QuestionAudioError = () => {
  const { questionAudioErrorMessage } = useInterviewSessionContext();
  return questionAudioErrorMessage ? <S.ErrorMessage role="status">{questionAudioErrorMessage}</S.ErrorMessage> : null;
};

export default QuestionAudioControl;
