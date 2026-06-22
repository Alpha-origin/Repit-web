import { useLocation } from "react-router-dom";

import type { PreparedInterviewData } from "@/features/interview-page/interview/api";
import { useInterviewSession } from "@/features/interview-page/interview/model/useInterviewSession";
import { INTERVIEW_DEFAULT_QUESTION } from "@/shared/constants/interview-page/interview";
import InterviewCameraView from "@/widgets/interview-page/interview/camera-view";
import InterviewContentView from "@/widgets/interview-page/interview/interview-content";
import * as S from "@/widgets/interview-page/interview/style";

const getPreparedInterviewFromState = (state: unknown) => {
  if (!state || typeof state !== "object" || !("preparedInterview" in state)) {
    return null;
  }

  const preparedInterview = (state as { preparedInterview?: unknown }).preparedInterview;

  if (!preparedInterview || typeof preparedInterview !== "object") {
    return null;
  }

  return preparedInterview as PreparedInterviewData;
};

const InterviewPage = () => {
  const location = useLocation();
  const preparedInterview = getPreparedInterviewFromState(location.state);
  const interviewSession = useInterviewSession(preparedInterview);
  const isVoiceMode = interviewSession.mode === "voice";
  const isTextMode = interviewSession.mode === "text";
  const isQuestionLoading = interviewSession.currentQuestion === null;
  const currentQuestion = {
    id: String(
      interviewSession.currentQuestion?.questionId ??
        (isQuestionLoading ? "준비중" : INTERVIEW_DEFAULT_QUESTION.id),
    ),
    text:
      interviewSession.currentQuestion?.content ??
      (isQuestionLoading
        ? "질문을 불러오는 중입니다. 잠시만 기다려주세요."
        : INTERVIEW_DEFAULT_QUESTION.text),
  };
  const answerStatus = isQuestionLoading
    ? "질문을 준비하고 있어요."
    : interviewSession.answerStatus;

  return (
    <S.Container $textMode={isTextMode} $voiceMode={isVoiceMode}>
      <S.Content $textMode={isTextMode} $voiceMode={isVoiceMode}>
        {isVoiceMode && (
          <InterviewCameraView
            cameraState={interviewSession.cameraState}
            videoRef={interviewSession.videoRef}
          />
        )}

        <InterviewContentView
          answerStatus={answerStatus}
          answerText={interviewSession.answerText}
          isVoiceStarted={interviewSession.isVoiceStarted}
          mode={interviewSession.mode}
          questionAudioStatus={interviewSession.questionAudioStatus}
          onAnswerTextChange={interviewSession.onAnswerTextChange}
          onClearAnswer={interviewSession.onClearAnswer}
          onCompleteVoice={interviewSession.onCompleteVoice}
          onModeChange={interviewSession.onModeChange}
          onStartVoice={interviewSession.onStartVoice}
          onSubmitText={interviewSession.onSubmitText}
          onToggleQuestionAudio={interviewSession.onToggleQuestionAudio}
          question={currentQuestion}
          voiceLevel={interviewSession.voiceLevel}
        />
      </S.Content>
    </S.Container>
  );
};

export default InterviewPage;
