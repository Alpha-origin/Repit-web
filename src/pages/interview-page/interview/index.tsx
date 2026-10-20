import { useInterviewEntry } from "@/features/interview-page/setting-company/model/useInterviewEntry";
import { useUserStore } from "@/shared/store/userStore";
import { loadSetupDraft } from "@/features/interview-page/setting-company/model/draftStore";
import { INTERVIEW_PREPARING_PATH } from "@/features/interview-page/setting-company/model/draft";
import CompanyBadge from "@/widgets/interview-page/company-badge";
import { useMemo } from "react";
import { Link, Navigate, useLocation, useParams } from "react-router-dom";

import type { PreparedInterviewData } from "@/features/interview-page/interview/api";
import {
  InterviewSessionProvider,
} from "@/features/interview-page/interview/model/interviewSessionContext";
import { useInterviewSessionContext } from "@/features/interview-page/interview/model/useInterviewSessionContext";
import { INTERVIEW_DEVICE_STATUS_LABELS } from "@/shared/constants/interview-page/interview";
import CameraIcon from "@/shared/img/interview-page/camara.svg?url";
import MicIcon from "@/shared/img/interview-page/mike.svg?url";
import Loading from "@/shared/components/loading";
import InterviewCameraView from "@/widgets/interview-page/interview/camera-view";
import InterviewContentView from "@/widgets/interview-page/interview/interview-content";
import InterviewDashboard from "@/widgets/interview-page/interview/interview-dashboard";
import InterviewQuitError from "@/widgets/interview-page/interview/quit-error";
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
  const { id } = useParams();
  const user = useUserStore();
  const preparedInterview = useMemo(
    () => getPreparedInterviewFromState(location.state),
    [location.state],
  );

  const draftId = new URLSearchParams(location.search).get("draftId");
  const entry = useInterviewEntry(preparedInterview, draftId, user.id, user.isLoaded);

  if (!user.isLoaded) return <Loading message="로그인 정보를 확인하고 있어요" />;
  if (!preparedInterview || preparedInterview.interviewId !== Number(id) || preparedInterview.userId !== user.id) {
    const draft = loadSetupDraft(draftId);
    if (draft?.submission?.interviewId === Number(id)) return <Navigate to={`${INTERVIEW_PREPARING_PATH}?draftId=${draft.draftId}`} replace />;
    return <S.PreparationErrorScreen role="alert">면접 정보를 복구할 수 없습니다. 사전 설정에서 다시 시작해주세요.<Link to="/main">메인으로 돌아가기</Link></S.PreparationErrorScreen>;
  }

  if (entry.error) return <S.PreparationErrorScreen role="alert">{entry.error}<Link to="/main">메인으로 돌아가기</Link></S.PreparationErrorScreen>;
  if (entry.isChecking || !entry.prepared) return <Loading message="면접 정보를 확인하고 있어요" />;

  return (
    <InterviewSessionProvider
      key={preparedInterview?.sessionId ?? location.pathname}
      preparedInterview={entry.prepared}
    >
      <InterviewPageContent />
    </InterviewSessionProvider>
  );
};

const InterviewPageContent = () => {
  const interviewSession = useInterviewSessionContext();
  const interviewRecorder = interviewSession.recorder;
  const elapsedSeconds = interviewSession.elapsedSeconds;
  const isMultiInterview = interviewSession.preparedInterview?.mode === "MULTI";
  const isVoiceMode = interviewSession.mode === "voice";
  const isTextMode = interviewSession.mode === "text";
  const isVoiceActionStarted = interviewSession.isVoiceStarted;
  const isQuestionLoading = interviewSession.currentQuestion === null;
  const isAwaitingResponse = interviewSession.isAwaitingResponse;
  const isStartActionDisabled =
    interviewRecorder.isStarting ||
    interviewRecorder.isStopping ||
    !interviewSession.isInterviewReady ||
    !interviewSession.isMediaReady ||
    isQuestionLoading ||
    isAwaitingResponse;
  const isCameraReady = interviewSession.cameraState === "ready" && interviewSession.isCameraEnabled;
  const isMicReady = interviewSession.micState === "ready" && interviewSession.isMicEnabled;
  const micLevel = isMicReady ? interviewSession.voiceLevel : 0;

  const handleQuitInterview = interviewSession.onQuitInterview;

  if (interviewSession.preparationError || (interviewSession.quitError && interviewSession.isPreparingInterview)) {
    return (
      <S.PreparationErrorScreen role="alert">
        <InterviewQuitError />
        <S.PreparationErrorMessage>
          {interviewSession.preparationError}
        </S.PreparationErrorMessage>
        {interviewSession.canRetryPreparation ? (
          <S.PreparationErrorAction
            type="button"
            disabled={interviewSession.isRetryingPreparation}
            onClick={() => void interviewSession.onRetryPreparation()}
          >
            {interviewSession.isRetryingPreparation ? "다시 요청 중…" : "다시 시도"}
          </S.PreparationErrorAction>
        ) : null}
        <S.PreparationErrorAction
          type="button"
          disabled={interviewSession.isRetryingPreparation || interviewSession.isClosing}
          onClick={() => void handleQuitInterview()}
        >
          메인으로 돌아가기
        </S.PreparationErrorAction>
      </S.PreparationErrorScreen>
    );
  }

  if (interviewSession.isPreparingInterview) {
    return <Loading message={interviewSession.isWaitingForQuestions
      ? "새 질문을 준비하고 있어요. 길게는 몇 분 걸릴 수 있어요"
      : "면접을 준비하고 있어요"} />;
  }

  if (isMultiInterview) {
    return <InterviewDashboard />;
  }

  const handleStartVoice = interviewSession.onStartVoice;
  const handleCompleteVoice = interviewSession.onCompleteVoice;

  return (
    <S.Container $textMode={isTextMode} $voiceMode={isVoiceMode}>
      <S.Content $textMode={isTextMode} $voiceMode={isVoiceMode}>
        <CompanyBadge />
        {isVoiceMode ? (
          <S.TopControlBar>
            <S.TopControls>
              <S.TimerPill aria-label={`경과 시간 ${formatElapsedTime(elapsedSeconds)}`}>
                <S.TimerDot aria-hidden="true" />
                {formatElapsedTime(elapsedSeconds)}
              </S.TimerPill>


            </S.TopControls>
          </S.TopControlBar>
        ) : null}

        <S.InterviewStage $textMode={isTextMode} $voiceMode={isVoiceMode}>
          <InterviewContentView />

          {isVoiceMode && (
            <InterviewCameraView />
          )}
        </S.InterviewStage>

        {interviewSession.isPreparingInterview ? (
          <S.PreparationMessage role="status" aria-live="polite">
            포트폴리오를 등록하고 있습니다. 분석이 끝날 때까지 잠시 기다려주세요.
          </S.PreparationMessage>
        ) : null}

        {interviewSession.recordingErrorMessage ? (
          <S.PreparationMessage role="alert">
            {interviewSession.recordingErrorMessage}
          </S.PreparationMessage>
        ) : null}

        {interviewSession.answerError ? (
          <S.PreparationMessage role="alert">{interviewSession.answerError}</S.PreparationMessage>
        ) : null}
        <InterviewQuitError />
        {isVoiceMode && (interviewSession.cameraState === "blocked" || interviewSession.micState === "blocked") ? (
          <S.PreparationMessage role="alert">카메라와 마이크 권한을 허용해주세요. 텍스트 면접은 사전설정에서 선택할 수 있습니다.</S.PreparationMessage>
        ) : null}
        <S.ActionRow>
          <S.SecondaryAction
            type="button"
            disabled={interviewSession.isClosing}
            onClick={() => void handleQuitInterview()}
          >
            그만두기
          </S.SecondaryAction>

          {isVoiceMode ? (
            <>
              <S.IconActionButton
                type="button"
                $active={isCameraReady}
                aria-label={interviewSession.cameraState === "ready" ? (isCameraReady ? "카메라 끄기" : "카메라 켜기") : INTERVIEW_DEVICE_STATUS_LABELS.camera[interviewSession.cameraState]}
                aria-pressed={isCameraReady}
                disabled={interviewSession.isMediaToggleDisabled || interviewSession.cameraState !== "ready"}
                onClick={interviewSession.onToggleCamera}
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
                type="button"
                $active={isMicReady}
                aria-label={interviewSession.micState === "ready" ? (isMicReady ? "마이크 끄기" : "마이크 켜기") : INTERVIEW_DEVICE_STATUS_LABELS.mic[interviewSession.micState]}
                aria-pressed={isMicReady}
                disabled={interviewSession.isMediaToggleDisabled || interviewSession.micState !== "ready"}
                onClick={interviewSession.onToggleMicrophone}
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
                    !interviewSession.isMicEnabled ? "마이크를 켜면 답변을 시작할 수 있어요."
                      : isStartActionDisabled && !isAwaitingResponse
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
