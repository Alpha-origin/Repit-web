import { useEffect, useRef, useState } from "react";
import type { ChangeEvent } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";

import { INTERVIEW_STATUS_MESSAGES } from "@/shared/constants/interview-page/interview";
import { useVoiceLevel } from "./useVoiceLevel";

const VOICE_RECOGNITION_OPTIONS = {
  continuous: true,
  interimResults: true,
  language: "ko-KR",
} as const;

const getVoiceStatus = ({
  browserSupportsSpeechRecognition,
  isMicrophoneAvailable,
  isVoiceStarted,
  listening,
}: {
  browserSupportsSpeechRecognition: boolean;
  isMicrophoneAvailable: boolean;
  isVoiceStarted: boolean;
  listening: boolean;
}) => {
  if (!browserSupportsSpeechRecognition) {
    return INTERVIEW_STATUS_MESSAGES.voiceUnsupported;
  }

  if (!isMicrophoneAvailable) {
    return INTERVIEW_STATUS_MESSAGES.voiceBlocked;
  }

  if (!isVoiceStarted) {
    return INTERVIEW_STATUS_MESSAGES.voiceIdle;
  }

  return listening
    ? INTERVIEW_STATUS_MESSAGES.voiceActive
    : INTERVIEW_STATUS_MESSAGES.voiceCompleting;
};

export const useVoiceAnswer = () => {
  const [answerText, setAnswerText] = useState("");
  const [isVoiceStarted, setIsVoiceStarted] = useState(false);
  const latestTranscriptRef = useRef("");
  const voiceLevel = useVoiceLevel(isVoiceStarted);
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable,
  } = useSpeechRecognition({
    clearTranscriptOnListen: false,
  });

  useEffect(() => {
    latestTranscriptRef.current = transcript.trim();
  }, [transcript]);

  useEffect(() => {
    return () => {
      void SpeechRecognition.abortListening();
    };
  }, []);

  const saveTranscriptToAnswer = () => {
    setAnswerText(latestTranscriptRef.current);
  };

  const handleStartVoice = async () => {
    if (!browserSupportsSpeechRecognition || isMicrophoneAvailable === false) {
      setIsVoiceStarted(false);
      return;
    }

    resetTranscript();
    setAnswerText("");
    setIsVoiceStarted(true);

    try {
      await SpeechRecognition.startListening(VOICE_RECOGNITION_OPTIONS);
    } catch {
      setIsVoiceStarted(false);
    }
  };

  const handleCompleteVoice = async () => {
    await SpeechRecognition.stopListening();
    saveTranscriptToAnswer();
    setIsVoiceStarted(false);
  };

  const handleExitVoiceMode = () => {
    void SpeechRecognition.stopListening();
    saveTranscriptToAnswer();
    setIsVoiceStarted(false);
  };

  const handleAnswerTextChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setAnswerText(event.target.value);
  };

  const handleClearAnswer = () => {
    setAnswerText("");
  };

  return {
    answerText,
    isVoiceStarted,
    onAnswerTextChange: handleAnswerTextChange,
    onClearAnswer: handleClearAnswer,
    onCompleteVoice: handleCompleteVoice,
    onExitVoiceMode: handleExitVoiceMode,
    onStartVoice: handleStartVoice,
    voiceLevel,
    voiceStatus: getVoiceStatus({
      browserSupportsSpeechRecognition,
      isMicrophoneAvailable,
      isVoiceStarted,
      listening,
    }),
  };
};
