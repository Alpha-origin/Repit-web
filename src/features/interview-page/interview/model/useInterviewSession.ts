import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from "react";
import { useBlocker, useNavigate } from "react-router-dom";

import {
  clearActiveInterviewSessionId,
  disconnectInterviewSocket,
  getActiveInterviewSessionId,
  getCurrentInterviewQuestion,
  getInterviewPreparation,
  quitInterview,
  retryInterviewPreparation,
  setActiveInterviewSessionId,
  submitInterviewAnswer,
  type CurrentInterviewQuestion,
  type InterviewProgressStatus,
  type PreparedInterviewData,
} from "@/features/interview-page/interview/api";
import {
  INTERVIEW_STATUS_MESSAGES,
} from "@/shared/constants/interview-page/interview";
import type { InterviewStyleOption } from "@/shared/constants/interview-page/setting-interview";

import { useElevenLabsTts } from "./useElevenLabsTts";
import { useSupertoneTts } from "./useSupertoneTts";
import { useInterviewElapsedTime } from "./useInterviewElapsedTime";
import { useInterviewMedia } from "./useInterviewMedia";
import { useInterviewRecorder } from "./useInterviewRecorder";
import { useAnswerRecorder } from "./useAnswerRecorder";
import { enqueueRecordingUpload, reportRecordingFailure } from "./interviewRecordingStore";
import { registerInterviewLifecycle } from "./activeInterviewLifecycle";
import type { RecordingEndReason } from "../api/upload-recording";
import { useInterviewSocket } from "./useInterviewSocket";
import { useVoiceAnswer } from "./useVoiceAnswer";
import { useVoiceLevel } from "./useVoiceLevel";

type InterviewCloseReason = "completed" | "quit";
const INTERVIEW_COMPLETED_PATH = "/main/interview/completed";
const AWAITING_RESPONSE_TIMEOUT_MS = 30_000;
const INTERVIEW_PREPARATION_POLL_INTERVAL_MS = 1_000;
const DEFAULT_SOLO_VOICE_INDEX = 1;
const INTERVIEW_PREPARATION_TIMEOUT_MS = 20 * 60_000;
const INTERVIEW_QUESTIONS_WAITING_POLL_INTERVAL_MS = 3_000;

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
  interviewStyle?: InterviewStyleOption,
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
  const mode = preparedInterview?.answerMode ?? "voice";
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompletingVoice, setIsCompletingVoice] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isAwaitingNextQuestion, setIsAwaitingNextQuestion] = useState(false);
  const [preparationError, setPreparationError] = useState<string | null>(null);
  const [answerError, setAnswerError] = useState<string | null>(null);
  const [isWaitingForQuestions, setIsWaitingForQuestions] = useState(
    preparedInterview?.questionPreparationStatus === "WAITING",
  );
  const [canRetryPreparation, setCanRetryPreparation] = useState(false);
  const [isRetryingPreparation, setIsRetryingPreparation] = useState(false);
  const [preparationAttempt, setPreparationAttempt] = useState(0);
  const retryRequestRef = useRef<AbortController | null>(null);
  const isVoiceMode = mode === "voice";
  const { cameraState, cloneAudioTrack, cloneVideoTrack, micState, micStream, videoRef, releaseMedia } =
    useInterviewMedia(isVoiceMode && !isClosing);
  const fullRecorder = useInterviewRecorder(cloneVideoTrack, cloneAudioTrack);
  const recorder = useAnswerRecorder(cloneAudioTrack);
  const { stopRecording: stopAnswerRecording, hasPendingRecording: hasPendingAnswerRecording } = recorder;
  const { startRecording: startFullRecording, stopRecording: stopFullRecording,
    hasPendingRecording: hasPendingFullRecording } = fullRecorder;
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
  const soloTtsVoiceIndex =
    preparedInterview?.mode === "SOLO"
      ? preparedInterview.interviewers?.[0]?.voiceIndex
      : undefined;
  const elevenLabsTts = useElevenLabsTts(
    currentQuestion?.content ?? "",
    soloTtsVoiceIndex ??
      (preparedInterview?.mode === "SOLO" && interviewStyle === "압박"
        ? DEFAULT_SOLO_VOICE_INDEX
        : multiTtsSpeaker?.voiceIndex),
    preparedInterview?.mode === "SOLO"
      ? {
          interviewStyle,
          personality: preparedInterview.personaType,
          tone: preparedInterview.tone,
        }
      : undefined,
  );
  const supertoneTts = useSupertoneTts(currentQuestion?.content ?? "");
  const questionTts = ttsProvider === "elevenlabs" ? elevenLabsTts : supertoneTts;
  const controlsRef = useRef({ questionTts, voiceAnswer });
  useEffect(() => { controlsRef.current = { questionTts, voiceAnswer }; });
  const sessionId = preparedInterview?.sessionId ?? getActiveInterviewSessionId();
  const isSessionClosedRef = useRef(false);
  const closePromiseRef = useRef<Promise<void> | null>(null);
  const closeReasonRef = useRef<InterviewCloseReason | null>(null);
  const hasNavigatedRef = useRef(false);
  const fullRecordingStartedRef = useRef(false);
  const answerRecordingRef = useRef<{
    question: CurrentInterviewQuestion;
    startedAt: number;
  } | null>(null);
  const answerStopPromiseRef = useRef<Promise<void> | null>(null);
  const answerTimeoutRef = useRef<number | null>(null);
  const completionRef = useRef<(reason: RecordingEndReason) => Promise<void>>(async () => {});
  const submittingRef = useRef(false);
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
    if (isVoiceMode && !isSessionClosedRef.current) void questionTts.onPlay();
  }, [
    clearAwaitingResponseTimeout,
    currentQuestion,
    isChatSessionReady,
    isVoiceMode,
    questionTts,
  ]);

  const syncCurrentQuestion = useCallback(
    (nextQuestion: CurrentInterviewQuestion) => {
      if (!isSessionClosedRef.current) dispatch({ type: "SYNC_QUESTION", question: nextQuestion });
    },
    [dispatch],
  );

  const advanceCurrentQuestion = useCallback(
    (nextQuestion: CurrentInterviewQuestion) => {
      dispatch({ type: "ADVANCE_QUESTION", question: nextQuestion });
    },
    [dispatch],
  );

  const clearAnswerTimeout = useCallback(() => {
    if (answerTimeoutRef.current !== null) {
      window.clearTimeout(answerTimeoutRef.current);
      answerTimeoutRef.current = null;
    }
  }, []);

  const finishAnswerRecording = useCallback((endReason: RecordingEndReason) => {
    clearAnswerTimeout();
    const recording = answerRecordingRef.current;
    answerRecordingRef.current = null;
    if (!recording) return answerStopPromiseRef.current ?? Promise.resolve();
    const pending = stopAnswerRecording().then((file) => {
      if (file && preparedInterview?.interviewId != null) {
        enqueueRecordingUpload({
          file, interviewId: preparedInterview.interviewId,
          kind: "ANSWER", questionId: recording.question.questionId, endReason,
        });
      } else if (!file && preparedInterview?.interviewId != null) {
        reportRecordingFailure({
          interviewId: preparedInterview.interviewId, kind: "ANSWER", questionId: recording.question.questionId,
          errorMessage: "답변 음성 파일을 만들지 못했습니다. 녹화 중 장치 연결과 브라우저 지원 여부를 확인해주세요.",
        });
      }
    });
    answerStopPromiseRef.current = pending;
    return pending;
  }, [clearAnswerTimeout, preparedInterview?.interviewId, stopAnswerRecording]);

  const endInterviewSession = useCallback(
    async (shouldNavigate: boolean, reason: InterviewCloseReason = "quit") => {
      if (!closePromiseRef.current) {
        isSessionClosedRef.current = true;
        closeReasonRef.current = reason;
        setIsClosing(true);
        clearAwaitingResponseTimeout();
        controlsRef.current.questionTts.onStop();
        controlsRef.current.voiceAnswer.onExitVoiceMode();
        const activeSessionId = sessionIdRef.current ?? getActiveInterviewSessionId();
        // 같은 종료 Promise를 HTTP, 소켓, 메뉴와 뒤로가기가 공유한다.
        closePromiseRef.current = (async () => {
          try {
            await Promise.all([
              finishAnswerRecording("interrupted"),
              stopFullRecording().then((file) => {
                if (file && preparedInterview?.interviewId != null) {
                  enqueueRecordingUpload({ file, interviewId: preparedInterview.interviewId, kind: "FULL_INTERVIEW" });
                } else if (!file && fullRecordingStartedRef.current && preparedInterview?.interviewId != null) {
                  reportRecordingFailure({
                    interviewId: preparedInterview.interviewId, kind: "FULL_INTERVIEW",
                    errorMessage: "전체 영상 파일을 만들지 못했습니다. 녹화 중 장치 연결과 브라우저 지원 여부를 확인해주세요.",
                  });
                }
              }),
            ]);
            if (activeSessionId && reason === "quit") await quitInterview(activeSessionId);
          } finally {
            releaseMedia();
            clearActiveInterviewSessionId();
            if (activeSessionId) disconnectInterviewSocket(activeSessionId);
          }
        })();
      }
      await closePromiseRef.current;
      if (shouldNavigate && closeReasonRef.current === reason && !hasNavigatedRef.current) {
        hasNavigatedRef.current = true;
        navigate(getInterviewExitPath(reason), {
          state: reason === "completed" ? { answeredQuestionCount: displayQuestionNumberRef.current } : undefined,
        });
      }
    },
    [clearAwaitingResponseTimeout, finishAnswerRecording, stopFullRecording,
      getInterviewExitPath, navigate, preparedInterview?.interviewId, releaseMedia],
  );

  useEffect(() => {
    if (!isVoiceMode || !canSubmitAnswer || cameraState !== "ready" || micState !== "ready" ||
      fullRecordingStartedRef.current || isSessionClosedRef.current) return;
    fullRecordingStartedRef.current = startFullRecording();
  }, [cameraState, canSubmitAnswer, startFullRecording, isVoiceMode, micState]);

  const closeLatestRef = useRef(endInterviewSession);
  useEffect(() => { closeLatestRef.current = endInterviewSession; }, [endInterviewSession]);
  useEffect(() => {
    const unregister = registerInterviewLifecycle(() => closeLatestRef.current(false, "quit"));
    const warnBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!hasPendingFullRecording() && !hasPendingAnswerRecording()) return;
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", warnBeforeUnload);
    return () => {
      unregister();
      window.removeEventListener("beforeunload", warnBeforeUnload);
      clearAnswerTimeout();
      if (!isSessionClosedRef.current) void closeLatestRef.current(false, "quit");
    };
  }, [clearAnswerTimeout, hasPendingFullRecording, hasPendingAnswerRecording]);

  const blocker = useBlocker(({ currentLocation, nextLocation }) =>
    !isSessionClosedRef.current && currentLocation.pathname !== nextLocation.pathname);
  useEffect(() => {
    if (blocker.state !== "blocked") return;
    void endInterviewSession(false, "quit").then(() => blocker.proceed());
  }, [blocker, endInterviewSession]);

  const handleSocketStatusChange = useCallback(
    ({
      question,
      status,
    }: {
      message: string | null;
      question: CurrentInterviewQuestion | null;
      status: InterviewProgressStatus | null;
    }) => {
      if (isSessionClosedRef.current) return;

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
    const abortController = new AbortController();
    let timeoutId: number | null = null;
    let lastErrorMessage: string | null = null;

    const safetyTimeoutId = window.setTimeout(() => {
      isCancelled = true;
      abortController.abort();
      preparingSessionIdRef.current = null;
      setCanRetryPreparation(false);
      setPreparationError(
        lastErrorMessage ?? "면접 준비 시간이 초과되었습니다. 잠시 후 다시 시도해주세요.",
      );
    }, INTERVIEW_PREPARATION_TIMEOUT_MS);

    const waitForChatSession = async () => {
      if (isCancelled) return;

      const { data, errorMessage } = await getInterviewPreparation(
        preparedInterview.interviewId,
        abortController.signal,
      );

      if (isCancelled || isSessionClosedRef.current) {
        return;
      }

      if (errorMessage || !data) {
        lastErrorMessage = errorMessage ?? "면접 준비 상태를 확인하지 못했습니다.";
      } else {
        lastErrorMessage = null;
      }

      if (data) {
        setIsWaitingForQuestions(data.status === "WAITING");
      }

      if (data?.preparationStatus === "READY") {
        window.clearTimeout(safetyTimeoutId);
        preparingSessionIdRef.current = null;
        setActiveInterviewSessionId(sessionId);
        sessionIdRef.current = sessionId;

        const firstQuestion = data.questions[0];

        if (firstQuestion) {
          syncCurrentQuestion(firstQuestion);
        }

        dispatch({ type: "SET_QUESTION_COUNT", count: data.questions.length });
        dispatch({ type: "SET_CHAT_SESSION_READY" });
        return;
      }

      if (data?.preparationStatus === "FAILED") {
        window.clearTimeout(safetyTimeoutId);
        setCanRetryPreparation(data.retryable);
        preparingSessionIdRef.current = null;
        setPreparationError(
          data.errorMessage ?? (data.failureStage === "CHAT_DELIVERY"
            ? "채팅 면접을 준비하지 못했습니다."
            : "면접 질문 준비에 실패했습니다."),
        );
        return;
      }

      const retryAfterMs = data?.status === "WAITING"
        ? INTERVIEW_QUESTIONS_WAITING_POLL_INTERVAL_MS
        : INTERVIEW_PREPARATION_POLL_INTERVAL_MS;

      timeoutId = window.setTimeout(() => {
        void waitForChatSession();
      }, retryAfterMs);
    };

    void waitForChatSession();

    return () => {
      isCancelled = true;
      abortController.abort();
      window.clearTimeout(safetyTimeoutId);

      if (timeoutId !== null) {
        window.clearTimeout(timeoutId);
      }

      if (preparingSessionIdRef.current === sessionId) {
        preparingSessionIdRef.current = null;
      }
    };
  }, [preparedInterview, preparationAttempt, sessionId, syncCurrentQuestion]);

  useEffect(() => () => retryRequestRef.current?.abort(), []);

  const handleRetryPreparation = async () => {
    if (!preparedInterview || !canRetryPreparation || retryRequestRef.current) return;
    const controller = new AbortController();
    retryRequestRef.current = controller;
    setIsRetryingPreparation(true);
    const { errorMessage } = await retryInterviewPreparation(
      preparedInterview.interviewId,
      controller.signal,
    );
    if (controller.signal.aborted) return;
    retryRequestRef.current = null;
    setIsRetryingPreparation(false);
    if (errorMessage) {
      setPreparationError(errorMessage);
      return;
    }
    setPreparationError(null);
    setCanRetryPreparation(false);
    setPreparationAttempt((attempt) => attempt + 1);
  };

  const handleStartVoice = async () => {
    if (!isVoiceMode || isSessionClosedRef.current || isCompletingVoiceRef.current ||
      submittingRef.current || isAwaitingNextQuestion || !canSubmitAnswer ||
      cameraState !== "ready" || micState !== "ready" || !fullRecorder.isRecording) return false;
    questionTts.onStop();
    if (!recorder.startRecording()) return false;
    answerRecordingRef.current = { question: currentQuestion, startedAt: questionStartedAtRef.current };
    setAnswerError(null);
    void voiceAnswer.onStartVoice();
    clearAnswerTimeout();
    answerTimeoutRef.current = window.setTimeout(() => {
      void completionRef.current("timeout");
    }, 210_000);
    return true;
  };

  const submitAnswer = async (
    content: string,
    submittedQuestion = currentQuestion,
    startedAt = questionStartedAtRef.current,
  ) => {
    if (isSessionClosedRef.current || submittingRef.current || isAwaitingNextQuestion || !canSubmitAnswer || !submittedQuestion) {
      return;
    }

    const trimmedContent = content.trim();

    if (!trimmedContent) {
      setAnswerError("답변을 인식하지 못했습니다. 다시 답변해주세요.");
      return;
    }

    submittingRef.current = true;
    setIsSubmitting(true);
    setAnswerError(null);
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

      const { data, errorMessage } = await submitInterviewAnswer({
        sessionId: activeSessionId,
        questionId: submittedQuestion.questionId,
        responseTime:
          startedAt > 0
            ? Math.max(
                0,
                Math.round((Date.now() - startedAt) / 1_000),
              )
            : 0,
        content: trimmedContent,
      });

      if (isSessionClosedRef.current) return;

      if (errorMessage) {
        setAnswerError(errorMessage);
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
      submittingRef.current = false;
      setIsSubmitting(false);
    }
  };

  const handleCompleteVoice = async (reason: RecordingEndReason = "user") => {
    const recording = answerRecordingRef.current;
    if (!recording || isSessionClosedRef.current || isCompletingVoiceRef.current || submittingRef.current || isAwaitingNextQuestion) return;
    isCompletingVoiceRef.current = true;
    setIsCompletingVoice(true);
    try {
      // 먼저 음성 파일을 확정해 업로드를 시작하고, 녹음 시작 때 보관한 질문으로 제출한다.
      await finishAnswerRecording(reason);
      if (isSessionClosedRef.current) return;
      const voiceContent = await voiceAnswer.onCompleteVoice();
      await submitAnswer(voiceContent || voiceAnswer.answerText, recording.question, recording.startedAt);
    } finally {
      isCompletingVoiceRef.current = false;
      setIsCompletingVoice(false);
    }
  };
  useEffect(() => { completionRef.current = handleCompleteVoice; });

  const handleSubmitText = async () => {
    if (!isVoiceMode) await submitAnswer(voiceAnswer.answerText);
  };
  const handleQuitInterview = () => endInterviewSession(true, "quit");

  return {
    answerStatus: isVoiceMode ? voiceAnswer.voiceStatus : INTERVIEW_STATUS_MESSAGES.text,
    answerText: voiceAnswer.answerText,
    cameraState,
    recorder,
    recordingErrorMessage: recorder.errorMessage ?? fullRecorder.errorMessage,
    answerError,
    currentQuestion,
    displayQuestionNumber,
    elapsedSeconds,
    interviewId: preparedInterview?.interviewId ?? null,
    isAwaitingNextQuestion,
    isAwaitingResponse: isClosing || isCompletingVoice || isSubmitting || isAwaitingNextQuestion || recorder.isStopping,
    isSubmitting,
    isClosing,
    isMediaReady: cameraState === "ready" && micState === "ready" && fullRecorder.isRecording,
    isInterviewReady: isChatSessionReady,
    isPreparingInterview: Boolean(preparedInterview) && !isChatSessionReady,
    isVoiceStarted: recorder.isRecording,
    mode,
    preparationError,
    canRetryPreparation,
    isRetryingPreparation,
    isWaitingForQuestions,
    onRetryPreparation: handleRetryPreparation,
    questionAudioStatus: questionTts.status,
    questionAudioErrorMessage:
      ttsProvider === "elevenlabs" ? elevenLabsTts.errorMessage : null,
    speakingPersonaId,
    ttsSpeakerPersonaId: multiTtsSpeaker?.personaId,
    onAnswerTextChange: voiceAnswer.onAnswerTextChange,
    onClearAnswer: voiceAnswer.onClearAnswer,
    onCompleteVoice: () => handleCompleteVoice("user"),
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
