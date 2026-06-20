import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  clearActiveInterviewSessionId,
  completeInterview,
  getActiveInterviewSessionId,
  quitInterview,
  submitInterviewAnswer,
  type PreparedInterviewData,
} from "@/features/interview-page/interview/api";
import { INTERVIEW_STATUS_MESSAGES } from "@/shared/constants/interview-page/interview";

import type { InterviewMode } from "@/widgets/interview-page/interview/type";
import { useSupertoneTts } from "./useSupertoneTts";
import { useInterviewCamera } from "./useInterviewCamera";
import { useVoiceAnswer } from "./useVoiceAnswer";

const FIRST_INTERVIEW_ID = 1;
const LAST_INTERVIEW_ID = 10;

export const useInterviewSession = (
  questionText: string,
  preparedInterview?: PreparedInterviewData | null,
) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [mode, setMode] = useState<InterviewMode>("voice");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const totalQuestionCount =
    preparedInterview?.questions.length && preparedInterview.questions.length > 0
      ? preparedInterview.questions.length
      : LAST_INTERVIEW_ID;
  const parsedInterviewId = Number(id);
  const currentInterviewId =
    parsedInterviewId >= FIRST_INTERVIEW_ID &&
    parsedInterviewId <= totalQuestionCount
      ? parsedInterviewId
      : FIRST_INTERVIEW_ID;
  const currentQuestion = preparedInterview?.questions[currentInterviewId - 1];
  const answerTargetId = currentQuestion?.questionId ?? currentInterviewId;
  const canSubmitAnswer = currentInterviewId <= totalQuestionCount;
  const isLastInterview = currentInterviewId >= totalQuestionCount;
  const isVoiceMode = mode === "voice";
  const { cameraState, videoRef } = useInterviewCamera(isVoiceMode);
  const voiceAnswer = useVoiceAnswer();
  const questionTts = useSupertoneTts(questionText);
  const preparedSessionId = preparedInterview?.sessionId ?? null;

  useEffect(() => {
    return () => {
      const activeSessionId = getActiveInterviewSessionId();

      if (!preparedSessionId || activeSessionId !== preparedSessionId) {
        return;
      }

      clearActiveInterviewSessionId();
      void quitInterview(activeSessionId);
    };
  }, [preparedSessionId]);

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

    const activeSessionId =
      preparedInterview?.sessionId ?? getActiveInterviewSessionId();

    if (!activeSessionId) {
      setIsSubmitting(false);
      return;
    }

    const { errorMessage } = await submitInterviewAnswer({
      sessionId: activeSessionId,
      questionId: answerTargetId,
      responseTime: 0,
      content: trimmedContent,
    });

    setIsSubmitting(false);

    if (errorMessage) {
      return;
    }

    if (isLastInterview) {
      clearActiveInterviewSessionId();

      if (activeSessionId) {
        await completeInterview(activeSessionId);
      }

      return;
    }

    navigate(`/main/interview/${currentInterviewId + 1}`, {
      state: preparedInterview ? { preparedInterview } : undefined,
    });
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
    currentInterviewId,
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
