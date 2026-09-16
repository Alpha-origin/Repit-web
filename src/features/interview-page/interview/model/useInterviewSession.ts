import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  clearActiveInterviewSessionId,
  disconnectInterviewSocket,
  getActiveInterviewSessionId,
  getCurrentInterviewQuestion,
  getInterviewPreparation,
  quitInterview,
  setActiveInterviewSessionId,
  submitInterviewAnswer,
  type CurrentInterviewQuestion,
  type InterviewProgressStatus,
  type PreparedInterviewData,
} from "@/features/interview-page/interview/api";
import {
  INTERVIEW_STATUS_MESSAGES,
} from "@/shared/constants/interview-page/interview";

import type { InterviewMode } from "@/widgets/interview-page/interview/type";
import { useElevenLabsTts } from "./useElevenLabsTts";
import { useSupertoneTts } from "./useSupertoneTts";
import { useInterviewElapsedTime } from "./useInterviewElapsedTime";
import { useInterviewMedia } from "./useInterviewMedia";
import { useInterviewSocket } from "./useInterviewSocket";
import { useVoiceAnswer } from "./useVoiceAnswer";
import { useVoiceLevel } from "./useVoiceLevel";

type InterviewCloseReason = "completed" | "quit";
const INTERVIEW_COMPLETED_PATH = "/main/interview/completed";
const AWAITING_RESPONSE_TIMEOUT_MS = 30_000;
const INTERVIEW_PREPARATION_POLL_INTERVAL_MS = 1_000;
const INTERVIEW_PREPARATION_MAX_ATTEMPTS = 120;

export type InterviewTtsProvider = "elevenlabs" | "supertone";

const buildQuestionKey = (question: CurrentInterviewQuestion | null) => {
  if (!question) {
    return null;
  }

  return [
    question.questionId,
    question.parentId,
    question.type,
    question.intention,
    question.content,
  ].join("|");
};

const buildInitialQuestion = (
  preparedInterview?: PreparedInterviewData | null,
): CurrentInterviewQuestion | null => {
  if (!preparedInterview || preparedInterview.questions.length === 0) {
    return null;
  }

  const nextQuestion =
    preparedInterview.questions[preparedInterview.currentQuestionIndex] ??
    preparedInterview.questions[0];

  if (!nextQuestion) {
    return null;
  }

  return {
    questionId: nextQuestion.questionId,
    parentId: 0,
    type: "ORIGINAL",
    intention: nextQuestion.intention,
    content: nextQuestion.content,
    personaId: nextQuestion.personaId,
  };
};

interface InterviewSessionState {
  currentQuestion: CurrentInterviewQuestion | null;
  displayQuestionNumber: number;
  interviewStatus: InterviewProgressStatus;
  isChatSessionReady: boolean;
  totalQuestionCount: number;
}

type InterviewSessionAction =
  | { type: "RESET_SESSION"; preparedInterview?: PreparedInterviewData | null }
  | { type: "SYNC_QUESTION"; question: CurrentInterviewQuestion }
  | { type: "ADVANCE_QUESTION"; question: CurrentInterviewQuestion }
  | { type: "SET_QUESTION_COUNT"; count: number }
  | { type: "SET_INTERVIEW_STATUS"; status: InterviewProgressStatus }
  | { type: "SET_CHAT_SESSION_READY" };

const buildInterviewSessionState = (
  preparedInterview?: PreparedInterviewData | null,
): InterviewSessionState => {
  const initialQuestion = buildInitialQuestion(preparedInterview);

  return {
    currentQuestion: initialQuestion,
    displayQuestionNumber: initialQuestion ? 1 : 0,
    interviewStatus: preparedInterview?.status ?? "IN_PROGRESS",
    isChatSessionReady: !preparedInterview,
    totalQuestionCount: preparedInterview?.questions.length ?? 0,
  };
};

const isSameQuestion = (
  left: CurrentInterviewQuestion | null,
  right: CurrentInterviewQuestion | null,
) => buildQuestionKey(left) === buildQuestionKey(right);

const isSameQuestionReference = (
  left: CurrentInterviewQuestion | null,
  right: CurrentInterviewQuestion | null,
) =>
  left !== null &&
  right !== null &&
  left.questionId === right.questionId &&
  left.parentId === right.parentId;

const isSameQuestionPrompt = (
  left: CurrentInterviewQuestion | null,
  right: CurrentInterviewQuestion | null,
) =>
  left !== null &&
  right !== null &&
  left.intention === right.intention &&
  left.content === right.content;

const isFollowUpQuestion = (question: CurrentInterviewQuestion | null) =>
  question !== null && question.questionId < 0;

const getFollowUpQuestionNumber = (
  question: CurrentInterviewQuestion | null,
) => {
  if (!isFollowUpQuestion(question)) {
    return null;
  }

  return Math.abs(question.questionId);
};

const getNextDisplayQuestionNumber = ({
  currentQuestion,
  currentQuestionNumber,
  nextQuestion,
}: {
  currentQuestion: CurrentInterviewQuestion | null;
  currentQuestionNumber: number;
  nextQuestion: CurrentInterviewQuestion;
}) => {
  if (isFollowUpQuestion(nextQuestion)) {
    return currentQuestionNumber > 0 ? currentQuestionNumber : 1;
  }

  if (
    currentQuestion === null ||
    isSameQuestionReference(currentQuestion, nextQuestion)
  ) {
    return currentQuestionNumber > 0 ? currentQuestionNumber : 1;
  }

  return currentQuestionNumber > 0 ? currentQuestionNumber + 1 : 1;
};

const interviewSessionReducer = (
  state: InterviewSessionState,
  action: InterviewSessionAction,
): InterviewSessionState => {
  switch (action.type) {
    case "RESET_SESSION": {
      const nextState = buildInterviewSessionState(action.preparedInterview);

      if (
        nextState.displayQuestionNumber === state.displayQuestionNumber &&
        nextState.interviewStatus === state.interviewStatus &&
        nextState.isChatSessionReady === state.isChatSessionReady &&
        isSameQuestion(nextState.currentQuestion, state.currentQuestion)
      ) {
        return state;
      }

      return nextState;
    }
    case "SYNC_QUESTION": {
      if (isSameQuestion(state.currentQuestion, action.question)) {
        return state;
      }

      return {
        ...state,
        currentQuestion: action.question,
        displayQuestionNumber: getNextDisplayQuestionNumber({
          currentQuestion: state.currentQuestion,
          currentQuestionNumber: state.displayQuestionNumber,
          nextQuestion: action.question,
        }),
      };
    }
    case "ADVANCE_QUESTION": {
      return {
        ...state,
        currentQuestion: action.question,
        displayQuestionNumber: getNextDisplayQuestionNumber({
          currentQuestion: state.currentQuestion,
          currentQuestionNumber: state.displayQuestionNumber,
          nextQuestion: action.question,
        }),
      };
    }
    case "SET_INTERVIEW_STATUS": {
      if (state.interviewStatus === action.status) {
        return state;
      }

      return { ...state, interviewStatus: action.status };
    }
    case "SET_QUESTION_COUNT": {
      const count = Math.max(0, action.count);

      return state.totalQuestionCount === count
        ? state
        : { ...state, totalQuestionCount: count };
    }
    case "SET_CHAT_SESSION_READY": {
      if (state.isChatSessionReady) {
        return state;
      }

      return { ...state, isChatSessionReady: true };
    }
  }
};

export const useInterviewSession = (
  preparedInterview?: PreparedInterviewData | null,
  ttsProvider: InterviewTtsProvider = "elevenlabs",
) => {
  const navigate = useNavigate();
  const [session, dispatch] = useReducer(
    interviewSessionReducer,
    preparedInterview,
    buildInterviewSessionState,
  );
  const {
    currentQuestion,
    displayQuestionNumber,
    isChatSessionReady,
    totalQuestionCount,
  } = session;
  const [mode, setMode] = useState<InterviewMode>(
    preparedInterview?.mode === "MULTI" || ttsProvider === "supertone"
      ? "text"
      : "voice",
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAwaitingNextQuestion, setIsAwaitingNextQuestion] = useState(false);
  const [preparationError, setPreparationError] = useState<string | null>(null);
  const isVoiceMode = mode === "voice";
  const { cameraState, micState, micStream, videoRef } = useInterviewMedia(isVoiceMode);
  const voiceLevel = useVoiceLevel(micStream);
  const voiceAnswer = useVoiceAnswer();
  const multiTtsSpeaker = useMemo(() => {
    if (preparedInterview?.mode !== "MULTI") {
      return undefined;
    }

    const interviewers = preparedInterview.interviewers ?? [];
    if (interviewers.length === 0) {
      return undefined;
    }

    // 질문에 연결된 persona를 우선 사용해야 질문 내용과 면접관 음성이 일치한다.
    // personaId가 없는 응답은 대표 면접관으로 대체해 성별이 섞이지 않게 한다.
    const speaker =
      (currentQuestion?.personaId
        ? interviewers.find(
            (interviewer) => interviewer.personaId === currentQuestion.personaId,
          )
        : undefined) ??
      interviewers.find(
        (interviewer) => interviewer.personaId === preparedInterview.personaId,
      ) ??
      interviewers[0];

    if (!speaker) {
      return undefined;
    }

    return {
      personaId: speaker.personaId,
      voiceIndex: speaker.voiceIndex ?? interviewers.indexOf(speaker) + 1,
    };
  }, [currentQuestion?.personaId, preparedInterview]);
  // TTS는 성별이 섞이지 않게 대표 면접관으로 대체하지만, 화면 강조는 질문에 실제로
  // 연결된 면접관에게만 준다. 대체 면접관까지 강조하면 personaId가 빠진 응답에서
  // 1번 면접관이 계속 질문하는 것처럼 보인다.
  const speakingPersonaId = useMemo(() => {
    const personaId = currentQuestion?.personaId;

    if (personaId === undefined) {
      return undefined;
    }

    if (preparedInterview?.mode !== "MULTI") {
      return personaId;
    }

    return (preparedInterview.interviewers ?? []).some(
      (interviewer) => interviewer.personaId === personaId,
    )
      ? personaId
      : undefined;
  }, [currentQuestion?.personaId, preparedInterview]);
  const elevenLabsTts = useElevenLabsTts(
    currentQuestion?.content ?? "",
    multiTtsSpeaker?.voiceIndex,
  );
  const supertoneTts = useSupertoneTts(currentQuestion?.content ?? "");
  const questionTts = ttsProvider === "elevenlabs" ? elevenLabsTts : supertoneTts;
  const sessionId = preparedInterview?.sessionId ?? getActiveInterviewSessionId();
  const isSessionClosedRef = useRef(false);
  const hasPreparedChatSessionRef = useRef(false);
  const preparingSessionIdRef = useRef<string | null>(null);
  const sessionIdRef = useRef<string | null>(sessionId);
  const displayQuestionNumberRef = useRef(displayQuestionNumber);
  const autoPlayedQuestionKeyRef = useRef<string | null>(null);
  const awaitingResponseTimeoutRef = useRef<number | null>(null);
  const isCompletingVoiceRef = useRef(false);
  const questionStartedAtRef = useRef(0);
  const canSubmitAnswer = isChatSessionReady && currentQuestion !== null;
  // 첫 질문이 도착한 시점을 면접 시작으로 본다.
  const elapsedSeconds = useInterviewElapsedTime(sessionId, canSubmitAnswer);
  const getInterviewExitPath = useCallback(
    (reason: InterviewCloseReason) =>
      reason === "completed" ? INTERVIEW_COMPLETED_PATH : "/main",
    [],
  );
  const clearAwaitingResponseTimeout = useCallback(() => {
    if (awaitingResponseTimeoutRef.current !== null) {
      window.clearTimeout(awaitingResponseTimeoutRef.current);
      awaitingResponseTimeoutRef.current = null;
    }
  }, []);
  const scheduleAwaitingResponseTimeout = useCallback(() => {
    clearAwaitingResponseTimeout();
    awaitingResponseTimeoutRef.current = window.setTimeout(() => {
      awaitingResponseTimeoutRef.current = null;
      setIsAwaitingNextQuestion(false);
    }, AWAITING_RESPONSE_TIMEOUT_MS);
  }, [clearAwaitingResponseTimeout]);

  useEffect(() => {
    return () => {
      clearAwaitingResponseTimeout();
    };
  }, [clearAwaitingResponseTimeout]);

  useEffect(() => {
    sessionIdRef.current = sessionId;
  }, [sessionId]);

  useEffect(() => {
    displayQuestionNumberRef.current = displayQuestionNumber;
  }, [displayQuestionNumber]);

  useEffect(() => {
    dispatch({ type: "RESET_SESSION", preparedInterview });
    isSessionClosedRef.current = false;
    hasPreparedChatSessionRef.current = false;
  }, [preparedInterview]);

  useEffect(() => {
    const nextQuestionKey = buildQuestionKey(currentQuestion);

    if (!isChatSessionReady || !currentQuestion || !nextQuestionKey) {
      return;
    }

    if (autoPlayedQuestionKeyRef.current === nextQuestionKey) {
      return;
    }

    autoPlayedQuestionKeyRef.current = nextQuestionKey;
    questionStartedAtRef.current = Date.now();
    // 새 질문(꼬리질문 포함)이 도착했다면 HTTP·소켓 경로와 무관하게 응답 대기를 끝낸다.
    clearAwaitingResponseTimeout();
    setIsAwaitingNextQuestion(false);
    void questionTts.onPlay();
  }, [
    clearAwaitingResponseTimeout,
    currentQuestion,
    isChatSessionReady,
    questionTts,
  ]);

  const syncCurrentQuestion = useCallback(
    (nextQuestion: CurrentInterviewQuestion) => {
      dispatch({ type: "SYNC_QUESTION", question: nextQuestion });
    },
    [dispatch],
  );

  const advanceCurrentQuestion = useCallback(
    (nextQuestion: CurrentInterviewQuestion) => {
      dispatch({ type: "ADVANCE_QUESTION", question: nextQuestion });
    },
    [dispatch],
  );

  const endInterviewSession = useCallback(
    async (
      shouldNavigateToMain: boolean,
      reason: InterviewCloseReason = "quit",
    ) => {
      const activeSessionId = sessionIdRef.current ?? getActiveInterviewSessionId();
      const nextPath = getInterviewExitPath(reason);
      const answeredQuestionCount = displayQuestionNumberRef.current;

      if (!activeSessionId || isSessionClosedRef.current) {
        if (shouldNavigateToMain) {
          navigate(nextPath, {
            state:
              reason === "completed"
                ? { answeredQuestionCount }
                : undefined,
          });
        }

        return;
      }

      isSessionClosedRef.current = true;
      clearActiveInterviewSessionId();
      if (reason === "quit") {
        await quitInterview(activeSessionId);
      }

      disconnectInterviewSocket(activeSessionId);

      if (shouldNavigateToMain) {
        navigate(nextPath, {
          state:
            reason === "completed"
              ? { answeredQuestionCount }
              : undefined,
        });
      }
    },
    [getInterviewExitPath, navigate],
  );

  const handleSocketStatusChange = useCallback(
    ({
      question,
      status,
    }: {
      message: string | null;
      question: CurrentInterviewQuestion | null;
      status: InterviewProgressStatus | null;
    }) => {
      if (question) {
        syncCurrentQuestion(question);
      }

      if (!status) {
        return;
      }

      dispatch({ type: "SET_INTERVIEW_STATUS", status });

      if (status === "COMPLETED") {
        void endInterviewSession(true, "completed");
      }
    },
    [endInterviewSession, syncCurrentQuestion],
  );

  useInterviewSocket({
    sessionId: isChatSessionReady ? sessionId : null,
    onQuestionReceived: syncCurrentQuestion,
    onStatusChange: handleSocketStatusChange,
  });

  useEffect(() => {
    if (!preparedInterview || !sessionId) {
      return;
    }

    if (preparingSessionIdRef.current === sessionId) {
      return;
    }

    preparingSessionIdRef.current = sessionId;
    let isCancelled = false;
    let attemptCount = 0;
    let timeoutId: number | null = null;
    let lastErrorMessage: string | null = null;

    const waitForChatSession = async () => {
      attemptCount += 1;

      const { data, errorMessage } = await getInterviewPreparation(
        preparedInterview.interviewId,
      );

      if (isCancelled) {
        return;
      }

      if (errorMessage || !data) {
        lastErrorMessage = errorMessage ?? "면접 준비 상태를 확인하지 못했습니다.";
      }

      if (data?.chatDelivered) {
        preparingSessionIdRef.current = null;
        setActiveInterviewSessionId(sessionId);
        sessionIdRef.current = sessionId;
        hasPreparedChatSessionRef.current = true;

        const firstQuestion = data.questions[0];

        if (firstQuestion) {
          syncCurrentQuestion(firstQuestion);
        }

        dispatch({ type: "SET_QUESTION_COUNT", count: data.questions.length });
        dispatch({ type: "SET_CHAT_SESSION_READY" });
        return;
      }

      if (data?.status === "FAILED") {
        preparingSessionIdRef.current = null;
        setPreparationError(data.errorMessage ?? "면접 질문 준비에 실패했습니다.");
        return;
      }

      if (attemptCount >= INTERVIEW_PREPARATION_MAX_ATTEMPTS) {
        preparingSessionIdRef.current = null;
        setPreparationError(
          lastErrorMessage ??
            "면접 준비 시간이 초과되었습니다. 잠시 후 다시 시도해주세요.",
        );
        return;
      }

      const retryAfterMs = data?.retryAfterMs ?? INTERVIEW_PREPARATION_POLL_INTERVAL_MS;

      timeoutId = window.setTimeout(() => {
        void waitForChatSession();
      }, retryAfterMs);
    };

    void waitForChatSession();

    return () => {
      isCancelled = true;

      if (timeoutId !== null) {
        window.clearTimeout(timeoutId);
      }

      if (preparingSessionIdRef.current === sessionId) {
        preparingSessionIdRef.current = null;
      }
    };
  }, [preparedInterview, sessionId, syncCurrentQuestion]);

  useEffect(() => {
    return () => {
      const activeSessionId = getActiveInterviewSessionId();
      const latestSessionId = sessionIdRef.current;

      if (
        !latestSessionId ||
        !hasPreparedChatSessionRef.current ||
        isSessionClosedRef.current ||
        activeSessionId !== latestSessionId
      ) {
        return;
      }

      clearActiveInterviewSessionId();
      disconnectInterviewSocket(activeSessionId);
    };
  }, []);

  const handleModeChange = (nextMode: InterviewMode) => {
    if (nextMode === mode) {
      return;
    }

    questionTts.onStop();

    if (isVoiceMode) {
      voiceAnswer.onExitVoiceMode();
    }

    setMode(nextMode);
  };

  const handleStartVoice = () => {
    if (!isChatSessionReady) {
      return;
    }

    if (isSubmitting || isAwaitingNextQuestion || !canSubmitAnswer) {
      return;
    }

    questionTts.onStop();
    void voiceAnswer.onStartVoice();
  };

  const submitAnswer = async (content: string) => {
    if (isSubmitting || isAwaitingNextQuestion || !canSubmitAnswer) {
      return;
    }

    const trimmedContent = content.trim();

    if (!trimmedContent) {
      return;
    }

    setIsSubmitting(true);
    // 제출이 끝나도 다음 질문이 도착할 때까지 대기 상태를 유지한다.
    setIsAwaitingNextQuestion(true);
    scheduleAwaitingResponseTimeout();

    try {
      const activeSessionId = sessionIdRef.current ?? getActiveInterviewSessionId();

      if (!activeSessionId) {
        clearAwaitingResponseTimeout();
        setIsAwaitingNextQuestion(false);
        return;
      }

      const submittedQuestion = currentQuestion;

      const { data, errorMessage } = await submitInterviewAnswer({
        sessionId: activeSessionId,
        questionId: currentQuestion.questionId,
        responseTime:
          questionStartedAtRef.current > 0
            ? Math.max(
                0,
                Math.round((Date.now() - questionStartedAtRef.current) / 1_000),
              )
            : 0,
        content: trimmedContent,
      });

      if (errorMessage) {
        clearAwaitingResponseTimeout();
        setIsAwaitingNextQuestion(false);
        return;
      }

      questionTts.onStop();
      voiceAnswer.onClearAnswer();

      if (data?.status) {
        dispatch({ type: "SET_INTERVIEW_STATUS", status: data.status });

        if (data.status === "COMPLETED") {
          clearAwaitingResponseTimeout();
          setIsAwaitingNextQuestion(false);
          await endInterviewSession(true, "completed");
          return;
        }
      }

      const responseQuestion = data?.question ?? null;
      const hasNextResponseQuestion =
        responseQuestion !== null &&
        !isSameQuestionPrompt(responseQuestion, submittedQuestion);

      if (responseQuestion) {
        if (hasNextResponseQuestion) {
          advanceCurrentQuestion(responseQuestion);
        } else {
          syncCurrentQuestion(responseQuestion);
        }
      }

      if (!hasNextResponseQuestion) {
        const { data: nextQuestion } = await getCurrentInterviewQuestion(activeSessionId);

        if (
          nextQuestion &&
          !isSameQuestionPrompt(nextQuestion, submittedQuestion)
        ) {
          advanceCurrentQuestion(nextQuestion);
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCompleteVoice = async () => {
    if (isCompletingVoiceRef.current || isSubmitting || isAwaitingNextQuestion) {
      return;
    }

    isCompletingVoiceRef.current = true;

    try {
      const voiceContent = await voiceAnswer.onCompleteVoice();
      await submitAnswer(voiceContent || voiceAnswer.answerText);
    } finally {
      isCompletingVoiceRef.current = false;
    }
  };

  const handleSubmitText = async () => {
    await submitAnswer(voiceAnswer.answerText);
  };

  const handleQuitInterview = async () => {
    questionTts.onStop();
    voiceAnswer.onExitVoiceMode();
    await endInterviewSession(true, "quit");
  };

  return {
    answerStatus: isVoiceMode ? voiceAnswer.voiceStatus : INTERVIEW_STATUS_MESSAGES.text,
    answerText: voiceAnswer.answerText,
    cameraState,
    currentQuestion,
    displayQuestionNumber,
    elapsedSeconds,
    isAwaitingNextQuestion,
    isAwaitingResponse: isSubmitting || isAwaitingNextQuestion,
    isSubmitting,
    isInterviewReady: isChatSessionReady,
    isPreparingInterview: Boolean(preparedInterview) && !isChatSessionReady,
    isVoiceStarted: voiceAnswer.isVoiceStarted,
    mode,
    preparationError,
    questionAudioStatus: questionTts.status,
    questionAudioErrorMessage:
      ttsProvider === "elevenlabs" ? elevenLabsTts.errorMessage : null,
    speakingPersonaId,
    ttsSpeakerPersonaId: multiTtsSpeaker?.personaId,
    onAnswerTextChange: voiceAnswer.onAnswerTextChange,
    onClearAnswer: voiceAnswer.onClearAnswer,
    onCompleteVoice: handleCompleteVoice,
    onModeChange: handleModeChange,
    onQuitInterview: handleQuitInterview,
    onStartVoice: handleStartVoice,
    onSubmitText: handleSubmitText,
    onToggleQuestionAudio: questionTts.onToggle,
    micState,
    videoRef,
    voiceLevel,
    totalQuestionCount,
    followUpQuestionNumber: getFollowUpQuestionNumber(currentQuestion),
  };
};
