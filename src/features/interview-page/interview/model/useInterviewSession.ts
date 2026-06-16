import { useState } from "react";

import { INTERVIEW_STATUS_MESSAGES } from "@/shared/constants/interview-page/interview";

import type { InterviewMode } from "@/widgets/interview-page/interview/type";
import { useSupertoneTts } from "./useSupertoneTts";
import { useInterviewCamera } from "./useInterviewCamera";
import { useVoiceAnswer } from "./useVoiceAnswer";

export const useInterviewSession = (questionText: string) => {
  const [mode, setMode] = useState<InterviewMode>("voice");
  const isVoiceMode = mode === "voice";
  const { cameraState, videoRef } = useInterviewCamera(isVoiceMode);
  const voiceAnswer = useVoiceAnswer();
  const questionTts = useSupertoneTts(questionText);

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
    questionTts.onStop();
    void voiceAnswer.onStartVoice();
  };

  return {
    answerStatus: isVoiceMode ? voiceAnswer.voiceStatus : INTERVIEW_STATUS_MESSAGES.text,
    answerText: voiceAnswer.answerText,
    cameraState,
    isVoiceStarted: voiceAnswer.isVoiceStarted,
    mode,
    questionAudioStatus: questionTts.status,
    onAnswerTextChange: voiceAnswer.onAnswerTextChange,
    onClearAnswer: voiceAnswer.onClearAnswer,
    onCompleteVoice: voiceAnswer.onCompleteVoice,
    onModeChange: handleModeChange,
    onStartVoice: handleStartVoice,
    onToggleQuestionAudio: questionTts.onToggle,
    videoRef,
    voiceLevel: voiceAnswer.voiceLevel,
  };
};
