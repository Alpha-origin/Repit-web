import { useInterviewSession } from "@/features/interview-page/interview/model/useInterviewSession";
import { INTERVIEW_DEFAULT_QUESTION } from "@/shared/constants/interview-page/interview";
import InterviewCameraView from "@/widgets/interview-page/interview/camera-view";
import InterviewContentView from "@/widgets/interview-page/interview/interview-content";
import * as S from "@/widgets/interview-page/interview/style";

const InterviewPage = () => {
  const interviewSession = useInterviewSession();
  const isVoiceMode = interviewSession.mode === "voice";
  const isTextMode = interviewSession.mode === "text";

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
          onAnswerTextChange={interviewSession.onAnswerTextChange}
          onClearAnswer={interviewSession.onClearAnswer}
          onModeChange={interviewSession.onModeChange}
          onStartVoice={interviewSession.onStartVoice}
          question={INTERVIEW_DEFAULT_QUESTION}
        />
      </S.Content>
    </S.Container>
  );
};

export default InterviewPage;
