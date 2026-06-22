import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  clearActiveInterviewSessionId,
  completeInterview,
  disconnectInterviewSocket,
  getActiveInterviewSessionId,
  getCurrentInterviewQuestion,
  prepareInterview,
  quitInterview,
  submitInterviewAnswer,
  type CurrentInterviewQuestion,
  type InterviewProgressStatus,
  type PreparedInterviewData,
} from "@/features/interview-page/interview/api";
import {
  INTERVIEW_STATUS_MESSAGES,
} from "@/shared/constants/interview-page/interview";

import type { InterviewMode } from "@/widgets/interview-page/interview/type";
import { useSupertoneTts } from "./useSupertoneTts";
import { useInterviewCamera } from "./useInterviewCamera";
import { useInterviewSocket } from "./useInterviewSocket";
import { useVoiceAnswer } from "./useVoiceAnswer";

type InterviewCloseReason = "completed" | "quit";

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
  };
};

export const useInterviewSession = (
  preparedInterview?: PreparedInterviewData | null,
) => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<InterviewMode>("voice");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<CurrentInterviewQuestion | null>(
    () => buildInitialQuestion(preparedInterview),
  );
  const [interviewStatus, setInterviewStatus] = useState<InterviewProgressStatus>(
    preparedInterview?.status ?? "IN_PROGRESS",
  );
  const [isChatSessionReady, setIsChatSessionReady] = useState(
    () => !preparedInterview,
  );
  const isVoiceMode = mode === "voice";
  const { cameraState, videoRef } = useInterviewCamera(isVoiceMode);
  const voiceAnswer = useVoiceAnswer();
  const questionTts = useSupertoneTts(currentQuestion?.content ?? "");
  const sessionId = preparedInterview?.sessionId ?? getActiveInterviewSessionId();
  const isSessionClosedRef = useRef(false);
  const preparedChatSessionIdRef = useRef<string | null>(null);
  const canSubmitAnswer =
    interviewStatus === "IN_PROGRESS" && currentQuestion !== null;

  useEffect(() => {
    setCurrentQuestion(buildInitialQuestion(preparedInterview));
    setInterviewStatus(preparedInterview?.status ?? "IN_PROGRESS");
    setIsChatSessionReady(!preparedInterview);
    isSessionClosedRef.current = false;
  }, [preparedInterview]);

  const applyCurrentQuestion = useCallback((nextQuestion: CurrentInterviewQuestion) => {
    setCurrentQuestion((previousQuestion) => {
      if (
        previousQuestion?.questionId === nextQuestion.questionId &&
        previousQuestion.content === nextQuestion.content &&
        previousQuestion.intention === nextQuestion.intention &&
        previousQuestion.type === nextQuestion.type
      ) {
        return previousQuestion;
      }

      return nextQuestion;
    });
  }, []);

  const endInterviewSession = useCallback(
    async (
      shouldNavigateToMain: boolean,
      reason: InterviewCloseReason = "quit",
    ) => {
      const activeSessionId = sessionId ?? getActiveInterviewSessionId();

      if (!activeSessionId || isSessionClosedRef.current) {
        if (shouldNavigateToMain) {
          navigate("/main");
        }

        return;
      }

      isSessionClosedRef.current = true;
      clearActiveInterviewSessionId();
      disconnectInterviewSocket(activeSessionId);
      if (reason === "completed") {
        await completeInterview(activeSessionId);
      } else {
        await quitInterview(activeSessionId);
      }

      if (shouldNavigateToMain) {
        navigate("/main");
      }
    },
    [navigate, sessionId],
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
        applyCurrentQuestion(question);
      }

      if (!status) {
        return;
      }

      setInterviewStatus(status);

      if (status === "COMPLETED") {
        void endInterviewSession(true, "completed");
      }
    },
    [applyCurrentQuestion, endInterviewSession],
  );

  useInterviewSocket({
    sessionId: isChatSessionReady ? sessionId : null,
    onQuestionReceived: applyCurrentQuestion,
    onStatusChange: handleSocketStatusChange,
  });

  useEffect(() => {
    if (!preparedInterview || !sessionId) {
      return;
    }

    if (preparedChatSessionIdRef.current === sessionId) {
      return;
    }

    preparedChatSessionIdRef.current = sessionId;

    const startInterviewSession = async () => {
      const { data, errorMessage } = await prepareInterview({
        sessionId,
        interviewId: preparedInterview.interviewId,
        userId: preparedInterview.userId,
        personaId: preparedInterview.personaId,
        personaType: preparedInterview.personaType,
        questions: preparedInterview.questions,
      });

      if (errorMessage || !data) {
        preparedChatSessionIdRef.current = null;
        return;
      }

      if (data.status) {
        setInterviewStatus(data.status);
      }

      const firstQuestion = buildInitialQuestion(data);

      if (firstQuestion) {
        applyCurrentQuestion(firstQuestion);
      }

      setIsChatSessionReady(true);

      if (!firstQuestion) {
        const { data: nextQuestion } = await getCurrentInterviewQuestion(data.sessionId);

        if (nextQuestion) {
          applyCurrentQuestion(nextQuestion);
        }
      }
    };

    void startInterviewSession();
  }, [applyCurrentQuestion, preparedInterview, sessionId]);

  useEffect(() => {
    return () => {
      const activeSessionId = getActiveInterviewSessionId();

      if (
        !sessionId ||
        isSessionClosedRef.current ||
        activeSessionId !== sessionId
      ) {
        return;
      }

      void endInterviewSession(false);
    };
  }, [endInterviewSession, sessionId]);

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
    if (isSubmitting || !canSubmitAnswer) {
      return;
    }

    questionTts.onStop();
    void voiceAnswer.onStartVoice();
  };

  const submitAnswer = async (content: string) => {
    if (isSubmitting || !canSubmitAnswer) {
      return;
    }

    const trimmedContent = content.trim();

    if (!trimmedContent) {
      return;
    }

    setIsSubmitting(true);

    const activeSessionId = sessionId ?? getActiveInterviewSessionId();

    if (!activeSessionId) {
      setIsSubmitting(false);
      return;
    }

    const { data, errorMessage } = await submitInterviewAnswer({
      sessionId: activeSessionId,
      questionId: currentQuestion.questionId,
      responseTime: 0,
      content: trimmedContent,
    });

    setIsSubmitting(false);

    if (errorMessage) {
      return;
    }

    questionTts.onStop();
    voiceAnswer.onClearAnswer();

    if (data?.question) {
      applyCurrentQuestion(data.question);
    }

    if (data?.status) {
      setInterviewStatus(data.status);

      if (data.status === "COMPLETED") {
        await endInterviewSession(true, "completed");
        return;
      }
    }

    if (!data?.question) {
      const { data: nextQuestion } = await getCurrentInterviewQuestion(activeSessionId);

      if (nextQuestion) {
        applyCurrentQuestion(nextQuestion);
      }
    }
  };

  const handleCompleteVoice = async () => {
    const voiceContent = await voiceAnswer.onCompleteVoice();
    await submitAnswer(voiceContent || voiceAnswer.answerText);
  };

  const handleSubmitText = async () => {
    await submitAnswer(voiceAnswer.answerText);
  };

  return {
    answerStatus: isVoiceMode ? voiceAnswer.voiceStatus : INTERVIEW_STATUS_MESSAGES.text,
    answerText: voiceAnswer.answerText,
    cameraState,
    currentQuestion,
    isVoiceStarted: voiceAnswer.isVoiceStarted,
    mode,
    questionAudioStatus: questionTts.status,
    onAnswerTextChange: voiceAnswer.onAnswerTextChange,
    onClearAnswer: voiceAnswer.onClearAnswer,
    onCompleteVoice: handleCompleteVoice,
    onModeChange: handleModeChange,
    onStartVoice: handleStartVoice,
    onSubmitText: handleSubmitText,
    onToggleQuestionAudio: questionTts.onToggle,
    videoRef,
    voiceLevel: voiceAnswer.voiceLevel,
  };
};
