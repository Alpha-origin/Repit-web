import { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";

import type { PreparedInterviewData } from "@/features/interview-page/interview/api";
import {
  InterviewSessionProvider,
} from "@/features/interview-page/interview/model/interviewSessionContext";
import { uploadRecordingInBackground } from "@/features/interview-page/interview/model/uploadRecordingInBackground";
import { useInterviewSessionContext } from "@/features/interview-page/interview/model/useInterviewSessionContext";
import { INTERVIEW_DEVICE_STATUS_LABELS } from "@/shared/constants/interview-page/interview";
import CameraIcon from "@/shared/img/interview-page/camara.svg?url";
import MicIcon from "@/shared/img/interview-page/mike.svg?url";
import Loading from "@/shared/components/loading";
import InterviewCameraView from "@/widgets/interview-page/interview/camera-view";
import InterviewContentView from "@/widgets/interview-page/interview/interview-content";
import InterviewDashboard from "@/widgets/interview-page/interview/interview-dashboard";
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

const formatElapsedTime = (elapsedSeconds: number) => {
  const minutes = Math.floor(elapsedSeconds / 60);
  const seconds = elapsedSeconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
};

const InterviewPage = () => {
  const location = useLocation();
  const preparedInterview = useMemo(
    () => getPreparedInterviewFromState(location.state),
    [location.state],
  );
  const ttsProvider = "elevenlabs" as const;

  return (
    <InterviewSessionProvider
      preparedInterview={preparedInterview}
      ttsProvider={ttsProvider}
    >
      <InterviewPageContent />
    </InterviewSessionProvider>
  );
};

const InterviewPageContent = () => {
  const interviewSession = useInterviewSessionContext();
  const interviewRecorder = interviewSession.recorder;
  const [isVoiceAnswering, setIsVoiceAnswering] = useState(false);
  const elapsedSeconds = interviewSession.elapsedSeconds;
  const isMultiInterview = interviewSession.preparedInterview?.mode === "MULTI";
  const isVoiceMode = interviewSession.mode === "voice";
  const isTextMode = interviewSession.mode === "text";
  const isVoiceActionStarted = isVoiceAnswering || interviewSession.isVoiceStarted;
  const isQuestionLoading = interviewSession.currentQuestion === null;
  const isAwaitingResponse = interviewSession.isAwaitingResponse;
  const isStartActionDisabled =
    interviewRecorder.isStarting ||
    interviewRecorder.isStopping ||
    !interviewSession.isInterviewReady ||
    isQuestionLoading ||
    isAwaitingResponse;
  const isCameraReady = interviewSession.cameraState === "ready";
  const isMicReady = interviewSession.micState === "ready";
  const micLevel = isMicReady ? interviewSession.voiceLevel : 0;

  const handleQuitInterview = async () => {
    const answeredQuestionId = interviewSession.currentQuestion?.questionId;
    const file = await interviewRecorder.stopRecording();
    uploadRecordingInBackground({
      file,
      interviewId: interviewSession.interviewId,
      questionId: answeredQuestionId,
    });
    await interviewSession.onQuitInterview();
  };

  if (interviewSession.preparationError) {
    return (
      <S.PreparationErrorScreen role="alert">
        <S.PreparationErrorMessage>
          {interviewSession.preparationError}
        </S.PreparationErrorMessage>
        <S.PreparationErrorAction
          type="button"
          onClick={() => void handleQuitInterview()}
        >
          메인으로 돌아가기
        </S.PreparationErrorAction>
      </S.PreparationErrorScreen>
    );
  }

  if (interviewSession.isPreparingInterview) {
    return <Loading message="포트폴리오 분석 및 면접 준비 중입니다..." />;
  }

  if (isMultiInterview) {
    return <InterviewDashboard />;
  }

  const handleStartVoice = async () => {
    if (isAwaitingResponse) {
      return;
    }

    if (!(await interviewSession.onStartVoice())) return;
    setIsVoiceAnswering(true);
  };

  const handleCompleteVoice = async () => {
    if (isAwaitingResponse) {
      return;
    }

    // onCompleteVoice 이후에는 다음 질문으로 바뀔 수 있으므로 먼저 저장한다.
    const answeredQuestionId = interviewSession.currentQuestion?.questionId;

    try {
      const file = await interviewRecorder.stopRecording();
      uploadRecordingInBackground({
        file,
        interviewId: interviewSession.interviewId,
        questionId: answeredQuestionId,
      });
      await interviewSession.onCompleteVoice();
    } finally {
      setIsVoiceAnswering(false);
    }
  };

  const handleModeChange = (nextMode: typeof interviewSession.mode) => {
    if (nextMode === "text") {
      void interviewRecorder.stopRecording();
      setIsVoiceAnswering(false);
    }

    interviewSession.onModeChange(nextMode);
  };

  return (
    <S.Container $textMode={isTextMode} $voiceMode={isVoiceMode}>
      <S.Content $textMode={isTextMode} $voiceMode={isVoiceMode}>
        {isVoiceMode ? (
          <S.TopControlBar>
            <S.TopControls>
              <S.TimerPill aria-label={`경과 시간 ${formatElapsedTime(elapsedSeconds)}`}>
                <S.TimerDot aria-hidden="true" />
                {formatElapsedTime(elapsedSeconds)}
              </S.TimerPill>

              <S.ModeControl>
                <S.ModeButton
                  type="button"
                  $active={interviewSession.mode === "text"}
                  aria-pressed={interviewSession.mode === "text"}
                  disabled={isAwaitingResponse}
                  onClick={() => handleModeChange("text")}
                >
                  텍스트
                </S.ModeButton>
                <S.ModeButton
                  type="button"
                  $active={interviewSession.mode === "voice"}
                  aria-pressed={interviewSession.mode === "voice"}
                  disabled={isAwaitingResponse}
                  onClick={() => handleModeChange("voice")}
                >
                  음성
                </S.ModeButton>
              </S.ModeControl>
            </S.TopControls>
          </S.TopControlBar>
        ) : null}

        <S.InterviewStage $textMode={isTextMode} $voiceMode={isVoiceMode}>
          <InterviewContentView onModeChange={handleModeChange} />

          {isVoiceMode && (
            <InterviewCameraView />
          )}
        </S.InterviewStage>

        {interviewSession.isPreparingInterview ? (
          <S.PreparationMessage role="status" aria-live="polite">
            포트폴리오를 등록하고 있습니다. 분석이 끝날 때까지 잠시 기다려주세요.
          </S.PreparationMessage>
        ) : null}

        {interviewRecorder.errorMessage ? (
          <S.PreparationMessage role="alert">
            {interviewRecorder.errorMessage}
          </S.PreparationMessage>
        ) : null}

        <S.ActionRow>
          <S.SecondaryAction
            type="button"
            onClick={() => void handleQuitInterview()}
          >
            그만두기
          </S.SecondaryAction>

          {isVoiceMode ? (
            <>
              <S.IconActionButton
                role="img"
                $active={isCameraReady}
                aria-label={INTERVIEW_DEVICE_STATUS_LABELS.camera[interviewSession.cameraState]}
              >
                <S.ActionIconImage
                  src={CameraIcon}
                  alt=""
                  aria-hidden="true"
                  $iconType="camera"
                  $muted={!isCameraReady}
                />
              </S.IconActionButton>
              <S.IconActionButton
                role="img"
                $active={isMicReady}
                aria-label={INTERVIEW_DEVICE_STATUS_LABELS.mic[interviewSession.micState]}
              >
                <S.IconActionLevelFill aria-hidden="true" $level={micLevel} />
                <S.ActionIconImage
                  src={MicIcon}
                  alt=""
                  aria-hidden="true"
                  $iconType="mic"
                  $muted={!isMicReady}
                />
              </S.IconActionButton>
              {isVoiceActionStarted ? (
                <S.PrimaryAction
                  type="button"
                  onClick={handleCompleteVoice}
                  disabled={isAwaitingResponse}
                  aria-busy={isAwaitingResponse}
                >
                  {isAwaitingResponse ? <S.ActionSpinner aria-hidden="true" /> : null}
                  끝내기
                </S.PrimaryAction>
              ) : (
                <S.PrimaryAction
                  type="button"
                  onClick={() => void handleStartVoice()}
                  disabled={isStartActionDisabled}
                  aria-disabled={isStartActionDisabled}
                  aria-busy={interviewSession.isPreparingInterview || isAwaitingResponse}
                  title={
                    isStartActionDisabled && !isAwaitingResponse
                      ? "포트폴리오를 등록하고 잠시 기다려주세요."
                      : undefined
                  }
                >
                  {isAwaitingResponse ? <S.ActionSpinner aria-hidden="true" /> : null}
                  {interviewSession.isPreparingInterview ? "준비 중..." : "시작하기"}
                </S.PrimaryAction>
              )}
            </>
          ) : null}
        </S.ActionRow>
      </S.Content>
    </S.Container>
  );
};

export default InterviewPage;
