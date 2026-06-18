import type { ChangeEvent } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { INTERVIEW_STATUS_MESSAGES } from "@/shared/constants/interview-page/interview";

const VOICE_LANGUAGE = "ko-KR";

const wait = (time: number) =>
  new Promise<void>((resolve) => {
    window.setTimeout(resolve, time);
  });

interface SpeechRecognitionResultItem {
  isFinal: boolean;
  0: {
    transcript: string;
  };
}

interface SpeechRecognitionResultListLike {
  length: number;
  [index: number]: SpeechRecognitionResultItem;
}

interface SpeechRecognitionEventLike extends Event {
  results: SpeechRecognitionResultListLike;
}

interface SpeechRecognitionErrorEventLike extends Event {
  error: string;
}

interface SpeechRecognitionLike {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onstart: (() => void) | null;
  onend: (() => void) | null;
  onerror: ((event: SpeechRecognitionErrorEventLike) => void) | null;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
}

type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;

const getSpeechRecognitionConstructor = () => {
  if (typeof window === "undefined") {
    return null;
  }

  const speechWindow = window as Window & {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  };

  return speechWindow.SpeechRecognition ?? speechWindow.webkitSpeechRecognition ?? null;
};

const getTranscriptText = (results: SpeechRecognitionResultListLike) => {
  const transcripts: string[] = [];

  for (let index = 0; index < results.length; index += 1) {
    const result = results[index];
    const transcript = result?.[0]?.transcript?.trim();

    if (!transcript) {
      continue;
    }

    transcripts.push(transcript);
  }

  return transcripts.join(" ").trim();
};

const getVoiceStatus = ({
  browserSupportsSpeechRecognition,
  isMicrophoneAvailable,
  isVoiceStarted,
  isListening,
}: {
  browserSupportsSpeechRecognition: boolean;
  isMicrophoneAvailable: boolean;
  isVoiceStarted: boolean;
  isListening: boolean;
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

  return isListening
    ? INTERVIEW_STATUS_MESSAGES.voiceActive
    : INTERVIEW_STATUS_MESSAGES.voiceCompleting;
};

export const useVoiceAnswer = () => {
  const [answerText, setAnswerText] = useState("");
  const [isVoiceStarted, setIsVoiceStarted] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isMicrophoneAvailable, setIsMicrophoneAvailable] = useState(true);
  const [voiceLevel, setVoiceLevel] = useState(0);
  const latestTranscriptTextRef = useRef("");
  const stopResolveRef = useRef<(() => void) | null>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const voiceLevelTimeoutRef = useRef<number | null>(null);
  const voiceLevelResetTimeoutRef = useRef<number | null>(null);
  const recognitionConstructor = useMemo(() => getSpeechRecognitionConstructor(), []);
  const browserSupportsSpeechRecognition = recognitionConstructor !== null;

  const clearVoiceLevelTimers = useCallback(() => {
    if (voiceLevelTimeoutRef.current) {
      window.clearTimeout(voiceLevelTimeoutRef.current);
      voiceLevelTimeoutRef.current = null;
    }

    if (voiceLevelResetTimeoutRef.current) {
      window.clearTimeout(voiceLevelResetTimeoutRef.current);
      voiceLevelResetTimeoutRef.current = null;
    }
  }, []);

  const animateVoiceLevel = useCallback(() => {
    clearVoiceLevelTimers();
    setVoiceLevel(1);

    voiceLevelTimeoutRef.current = window.setTimeout(() => {
      setVoiceLevel(0.45);
    }, 120);

    voiceLevelResetTimeoutRef.current = window.setTimeout(() => {
      setVoiceLevel(0.1);
    }, 260);
  }, [clearVoiceLevelTimers]);

  useEffect(() => {
    if (!recognitionConstructor) {
      return;
    }

    const recognition = new recognitionConstructor();

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = VOICE_LANGUAGE;
    recognition.onstart = () => {
      setIsListening(true);
      setVoiceLevel(0.18);
    };
    recognition.onend = () => {
      setIsListening(false);
      clearVoiceLevelTimers();
      setVoiceLevel(0);
      stopResolveRef.current?.();
      stopResolveRef.current = null;
    };
    recognition.onerror = (event) => {
      if (event.error === "not-allowed" || event.error === "service-not-allowed") {
        setIsMicrophoneAvailable(false);
      }

      if (event.error !== "aborted") {
        setIsVoiceStarted(false);
      }
    };
    recognition.onresult = (event) => {
      const previousTranscript = latestTranscriptTextRef.current;
      const nextTranscript = getTranscriptText(event.results);

      latestTranscriptTextRef.current = nextTranscript;
      setAnswerText(nextTranscript);

      if (nextTranscript && nextTranscript !== previousTranscript) {
        animateVoiceLevel();
      }
    };

    recognitionRef.current = recognition;

    return () => {
      clearVoiceLevelTimers();
      stopResolveRef.current?.();
      stopResolveRef.current = null;
      recognition.abort();
      recognitionRef.current = null;
    };
  }, [animateVoiceLevel, clearVoiceLevelTimers, recognitionConstructor]);

  const saveCurrentTranscript = () => {
    const nextAnswerText = latestTranscriptTextRef.current.trim();

    setAnswerText(nextAnswerText);

    return nextAnswerText;
  };

  const waitForStop = () =>
    new Promise<void>((resolve) => {
      let isResolved = false;

      const finish = () => {
        if (isResolved) {
          return;
        }

        isResolved = true;
        stopResolveRef.current = null;
        resolve();
      };

      stopResolveRef.current = finish;
      window.setTimeout(finish, 1000);
    });

  const handleStartVoice = async () => {
    const recognition = recognitionRef.current;

    if (!recognition) {
      setIsVoiceStarted(false);
      return;
    }

    latestTranscriptTextRef.current = "";
    setAnswerText("");
    setIsMicrophoneAvailable(true);
    setVoiceLevel(0);

    try {
      recognition.start();
      setIsVoiceStarted(true);
    } catch {
      setIsVoiceStarted(false);
    }
  };

  const handleCompleteVoice = async () => {
    const recognition = recognitionRef.current;
    const currentAnswerText = saveCurrentTranscript();

    setIsVoiceStarted(false);

    if (recognition) {
      try {
        await wait(350);
        const stopPromise = waitForStop();

        recognition.stop();
        await stopPromise;
      } catch {
        setIsListening(false);
      }
    }

    await wait(200);
    clearVoiceLevelTimers();
    setVoiceLevel(0);

    const nextAnswerText = saveCurrentTranscript() || currentAnswerText;
    return nextAnswerText;
  };

  const handleExitVoiceMode = () => {
    recognitionRef.current?.abort();
    clearVoiceLevelTimers();
    setVoiceLevel(0);
    saveCurrentTranscript();
    setIsVoiceStarted(false);
  };

  const handleAnswerTextChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setAnswerText(event.target.value);
  };

  const handleClearAnswer = () => {
    latestTranscriptTextRef.current = "";
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
      isListening,
      isVoiceStarted,
    }),
  };
};
