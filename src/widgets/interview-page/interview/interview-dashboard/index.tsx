import { useEffect, useMemo, useRef, useState } from "react";
import { INTERVIEW_DEVICE_STATUS_LABELS } from "@/shared/constants/interview-page/interview";
import { PERSONALITY_OPTIONS } from "@/shared/constants/interview-page/setting-multi-interview";

import { useInterviewSessionContext } from "@/features/interview-page/interview/model/useInterviewSessionContext";
import CameraIcon from "@/shared/img/interview-page/camara.svg?url";
import MicIcon from "@/shared/img/interview-page/mike.svg?url";
import InterviewCameraView from "@/widgets/interview-page/interview/camera-view";
import * as S from "./style";

const TEXT_ANSWER_MAX_LENGTH = 10_000;

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(remainder).padStart(2, "0")}`;
};

const getMemoKey = (sessionId?: string) =>
  sessionId ? `interview-memo:${sessionId}` : null;

const InterviewDashboard = () => {
  const interview = useInterviewSessionContext();
  const [isVoiceAnswering, setIsVoiceAnswering] = useState(false);
  const elapsedSeconds = interview.elapsedSeconds;
  const sessionId = interview.preparedInterview?.sessionId;
  const memoKey = useMemo(() => getMemoKey(sessionId), [sessionId]);
  const [memo, setMemo] = useState(() =>
    memoKey ? window.sessionStorage.getItem(memoKey) ?? "" : "",
  );
  const isMultiInterview = interview.preparedInterview?.mode === "MULTI";
  const isVoiceMode = interview.mode === "voice";
  const isQuestionLoading = interview.currentQuestion === null;
  const isQuestionSpeaking = interview.questionAudioStatus === "playing";
  const speakingPersonaId = interview.speakingPersonaId;
  const lastSpeakingPersonaIdRef = useRef<number | undefined>(undefined);
  // 질문이 도착한 뒤 다음 질문이 올 때까지 같은 면접관을 강조한다.
  // 질문 로딩 구간에는 personaId가 비므로 직전 발화자를 유지해 강조가 끊기지 않게 한다.
  const activePersonaId = speakingPersonaId ?? lastSpeakingPersonaIdRef.current;
  const interviewers = interview.preparedInterview?.interviewers ?? [];
  const activeInterviewer = interviewers.find(
    (interviewer) => interviewer.personaId === activePersonaId,
  );
  const isAwaitingResponse = interview.isAwaitingResponse;
  const questionNumber = String(
    Math.max(interview.displayQuestionNumber, 1),
  ).padStart(2, "0");
  const questionLabel =
    interview.followUpQuestionNumber === null
      ? questionNumber
      : `${questionNumber}-${interview.followUpQuestionNumber}`;
  const isAnswerDisabled =
    !interview.isInterviewReady || isQuestionLoading || isAwaitingResponse;
  const isCameraReady = interview.cameraState === "ready";
  const isMicReady = interview.micState === "ready";
  const micLevel = isMicReady ? interview.voiceLevel : 0;

  useEffect(() => {
    lastSpeakingPersonaIdRef.current = undefined;
  }, [sessionId]);

  useEffect(() => {
    if (speakingPersonaId !== undefined) {
      lastSpeakingPersonaIdRef.current = speakingPersonaId;
    }
  }, [speakingPersonaId]);

  useEffect(() => {
    setMemo(memoKey ? window.sessionStorage.getItem(memoKey) ?? "" : "");
  }, [memoKey]);

  useEffect(() => {
    if (memoKey) {
      window.sessionStorage.setItem(memoKey, memo);
    }
  }, [memo, memoKey]);

  const handleModeChange = (mode: typeof interview.mode) => {
    if (mode === "text") {
      setIsVoiceAnswering(false);
    }

    interview.onModeChange(mode);
  };

  const handleStartVoice = () => {
    if (isAwaitingResponse) {
      return;
    }

    setIsVoiceAnswering(true);
    interview.onStartVoice();
  };

  const handleCompleteVoice = async () => {
    if (isAwaitingResponse) {
      return;
    }

    try {
      await interview.onCompleteVoice();
    } finally {
      setIsVoiceAnswering(false);
    }
  };

  return (
    <S.Page $multi={isMultiInterview}>
      <S.Content $multi={isMultiInterview}>
        <S.Timer aria-label={`경과 시간 ${formatTime(elapsedSeconds)}`}>
          <S.TimerDot aria-hidden="true" />
          {formatTime(elapsedSeconds)}
        </S.Timer>

        <S.MainGrid $multi={isMultiInterview} $count={interviewers.length}>
          <S.LeftColumn $multi={isMultiInterview}>
            <S.QuestionPanel $multi={isMultiInterview} aria-live="polite">
              <S.QuestionMetaRow>
                <S.QuestionTag>
                  {isMultiInterview
                    ? `Question ${questionLabel} / ${interview.totalQuestionCount}`
                    : `Question ${questionLabel}${interview.totalQuestionCount > 0 ? ` · 기본 질문 ${interview.totalQuestionCount}개` : ""}`}
                </S.QuestionTag>
                {!isMultiInterview ? (
                  <S.QuestionAudioButton
                    type="button"
                    disabled={isQuestionLoading || interview.questionAudioStatus === "loading"}
                    onClick={interview.onToggleQuestionAudio}
                  >
                    {interview.questionAudioStatus === "loading"
                      ? "음성 생성 중..."
                      : interview.questionAudioStatus === "playing"
                        ? "질문 멈추기"
                        : "질문 듣기"}
                  </S.QuestionAudioButton>
                ) : null}
              </S.QuestionMetaRow>
              {activeInterviewer && !isMultiInterview ? (
                <S.QuestionSpeaker>
                  {activeInterviewer.name} · {activeInterviewer.roleLabel}
                </S.QuestionSpeaker>
              ) : null}
              <S.QuestionText>
                {interview.currentQuestion?.content ?? "질문을 불러오는 중입니다."}
              </S.QuestionText>
              {interview.questionAudioErrorMessage ? (
                <S.QuestionAudioError role="status">
                  {interview.questionAudioErrorMessage}
                </S.QuestionAudioError>
              ) : null}
            </S.QuestionPanel>

            <S.AnswerPanel $multi={isMultiInterview}>
              <S.AnswerTabs>
                <S.Tab
                  type="button"
                  $active={isVoiceMode}
                  aria-pressed={isVoiceMode}
                  disabled={isAwaitingResponse}
                  onClick={() => handleModeChange("voice")}
                >
                  영상/음성 답변
                </S.Tab>
                <S.Tab
                  type="button"
                  $active={!isVoiceMode}
                  aria-pressed={!isVoiceMode}
                  disabled={isAwaitingResponse}
                  onClick={() => handleModeChange("text")}
                >
                  텍스트 답변
                </S.Tab>
              </S.AnswerTabs>

              {isVoiceMode ? (
                <S.VideoArea>
                  <InterviewCameraView />
                  <S.VideoControls>
                    <S.StatusIndicator
                      $active={isCameraReady}
                      role="img"
                      aria-label={INTERVIEW_DEVICE_STATUS_LABELS.camera[interview.cameraState]}
                    >
                      <S.StatusIcon src={CameraIcon} alt="" aria-hidden="true" $muted={!isCameraReady} />
                    </S.StatusIndicator>
                    <S.StatusIndicator
                      $active={isMicReady}
                      role="img"
                      aria-label={INTERVIEW_DEVICE_STATUS_LABELS.mic[interview.micState]}
                    >
                      <S.StatusLevelFill aria-hidden="true" $level={micLevel} />
                      <S.StatusIcon src={MicIcon} alt="" aria-hidden="true" $muted={!isMicReady} />
                    </S.StatusIndicator>
                  </S.VideoControls>
                </S.VideoArea>
              ) : (
                <S.TextArea
                  $multi={isMultiInterview}
                  value={interview.answerText}
                  maxLength={TEXT_ANSWER_MAX_LENGTH}
                  placeholder="이곳에 답변을 입력해주세요. 자신의 경험과 성과를 구체적인 수치와 함께 작성하면 좋은 평가를 받을 수 있습니다."
                  readOnly={isAwaitingResponse}
                  onChange={interview.onAnswerTextChange}
                />
              )}

              <S.BottomRow>
                <S.Count>글자 수 {interview.answerText.length} / {TEXT_ANSWER_MAX_LENGTH}</S.Count>
                <S.Actions>
                  {!isMultiInterview ? (
                    <S.Button
                      type="button"
                      $secondary
                      onClick={() => void interview.onQuitInterview()}
                    >
                      그만두기
                    </S.Button>
                  ) : null}
                  {isVoiceMode ? (
                    isVoiceAnswering || interview.isVoiceStarted ? (
                      <S.Button
                        type="button"
                        disabled={isAwaitingResponse}
                        aria-busy={isAwaitingResponse}
                        onClick={() => void handleCompleteVoice()}
                      >
                        {isAwaitingResponse ? "응답 대기중..." : "답변 끝내기"}
                      </S.Button>
                    ) : (
                      <S.Button
                        type="button"
                        disabled={isAnswerDisabled}
                        aria-busy={isAwaitingResponse}
                        onClick={handleStartVoice}
                      >
                        {isAwaitingResponse ? "응답 대기중..." : "음성 답변 시작"}
                      </S.Button>
                    )
                  ) : (
                    <S.Button
                      type="button"
                      disabled={isAnswerDisabled || !interview.answerText.trim()}
                      aria-busy={isAwaitingResponse}
                      onClick={() => void interview.onSubmitText()}
                    >
                      {interview.isSubmitting
                        ? "제출 중..."
                        : interview.isAwaitingNextQuestion
                          ? "응답 대기중..."
                          : "제출하기"}
                    </S.Button>
                  )}
                </S.Actions>
              </S.BottomRow>
            </S.AnswerPanel>
          </S.LeftColumn>

          <S.RightColumn $multi={isMultiInterview}>
            <S.Interviewers $multi={isMultiInterview} $count={interviewers.length} aria-label="면접관 목록">
              {interviewers.map((interviewer) => {
                const isActive = interviewer.personaId === activePersonaId;

                return (
                  <S.InterviewerCard
                    key={interviewer.personaId}
                    $active={isActive}
                    $multi={isMultiInterview}
                    aria-current={isActive ? "true" : undefined}
                  >
                    {interviewer.image ? (
                      <S.InterviewerImage
                        $multi={isMultiInterview}
                        src={interviewer.image}
                        alt={`${interviewer.name} 면접관`}
                      />
                    ) : (
                      <S.InterviewerFallback aria-hidden="true">
                        {interviewer.name.slice(0, 1)}
                      </S.InterviewerFallback>
                    )}
                    <S.InterviewerName>{interviewer.name}</S.InterviewerName>
                    <S.InterviewerRole>{interviewer.roleLabel}</S.InterviewerRole>
                    {isMultiInterview ? (
                      <S.InterviewerTags>
                        <S.InterviewerTag>
                          {PERSONALITY_OPTIONS.find((option) => option.value === (interviewer.personaType ?? interview.preparedInterview?.personaType))?.label ?? "친근한"}
                        </S.InterviewerTag>
                        <S.InterviewerTag>
                          {(interviewer.level ?? interview.preparedInterview?.level) === "HARD"
                            ? "어려움"
                            : (interviewer.level ?? interview.preparedInterview?.level) === "NORMAL"
                              ? "보통"
                              : "쉬움"}
                        </S.InterviewerTag>
                        {isActive ? (
                          <S.ActiveBadge $speaking={isQuestionSpeaking}>
                            {isQuestionSpeaking ? "질문 중" : "답변 대기"}
                          </S.ActiveBadge>
                        ) : null}
                      </S.InterviewerTags>
                    ) : null}
                    {!isMultiInterview && isActive ? (
                      <S.ActiveBadge $speaking={isQuestionSpeaking}>
                        {isQuestionSpeaking ? "질문 중" : "답변 대기"}
                      </S.ActiveBadge>
                    ) : null}
                  </S.InterviewerCard>
                );
              })}
            </S.Interviewers>

            <S.MemoPanel $multi={isMultiInterview}>
              <S.MemoLabel htmlFor="interview-memo">메모</S.MemoLabel>
              <S.MemoTextArea
                id="interview-memo"
                value={memo}
                placeholder="기억해야 할 키워드를 자유롭게 적어보세요.&#10;평가에 반영되지 않습니다."
                onChange={(event) => setMemo(event.target.value)}
              />
            </S.MemoPanel>
          </S.RightColumn>
        </S.MainGrid>

        {interview.isAwaitingNextQuestion ? (
          <S.LoadingOverlay role="status" aria-live="polite">
            <S.LoadingModal>
              <S.LoadingSpinner aria-hidden="true" />
              <S.LoadingMessage>다음 질문을 준비하고 있습니다</S.LoadingMessage>
            </S.LoadingModal>
          </S.LoadingOverlay>
        ) : null}
      </S.Content>
    </S.Page>
  );
};

export default InterviewDashboard;
