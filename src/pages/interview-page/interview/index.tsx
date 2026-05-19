import { useInterviewSession } from "@/features/interview-page/interview/model/useInterviewSession";
import { INTERVIEW_DEFAULT_QUESTION } from "@/shared/constants/interview-page/interview";
import InterviewCameraView from "@/widgets/interview-page/interview/camera-view";
import InterviewContentView from "@/widgets/interview-page/interview/interview-content";
import * as S from "@/widgets/interview-page/interview/style";

const InterviewPage = () => {
  const interviewSession = useInterviewSession();

  return (
    <S.Container>
      <S.Content>
        {interviewSession.mode === "voice" && (
          <InterviewCameraView
            cameraState={interviewSession.cameraState}
            videoRef={interviewSession.videoRef}
          />
        )}

        <InterviewContentView
          answerStatus={interviewSession.answerStatus}
          answerText={interviewSession.answerText}
          mode={interviewSession.mode}
          onAnswerTextChange={interviewSession.onAnswerTextChange}
          onClearAnswer={interviewSession.onClearAnswer}
          onModeChange={interviewSession.onModeChange}
          onReset={interviewSession.onReset}
          question={INTERVIEW_DEFAULT_QUESTION}
        />
      </S.Content>
    </S.Container>
  );
};

export default InterviewPage;
