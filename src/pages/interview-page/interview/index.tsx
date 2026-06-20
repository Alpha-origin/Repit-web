import { useLocation, useParams } from "react-router-dom";

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
  const { id } = useParams();
  const location = useLocation();
  const preparedInterview = getPreparedInterviewFromState(location.state);
  const routeInterviewIndex = Number(id);
  const preparedQuestion =
    routeInterviewIndex >= 1
      ? preparedInterview?.questions[routeInterviewIndex - 1] ?? null
      : null;
  const interviewSession = useInterviewSession(
    preparedQuestion?.content ?? INTERVIEW_DEFAULT_QUESTION.text,
    preparedInterview,
  );
  const isVoiceMode = interviewSession.mode === "voice";
  const isTextMode = interviewSession.mode === "text";
  const currentPreparedQuestion =
    preparedInterview?.questions[interviewSession.currentInterviewId - 1] ?? null;
  const currentQuestion = {
    id: String(currentPreparedQuestion?.questionId ?? interviewSession.currentInterviewId),
    text: currentPreparedQuestion?.content ?? INTERVIEW_DEFAULT_QUESTION.text,
  };

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
          answerStatus={interviewSession.answerStatus}
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
