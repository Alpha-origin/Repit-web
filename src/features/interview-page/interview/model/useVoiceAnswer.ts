import type { ChangeEvent } from "react";
import { useEffect, useMemo, useRef, useState } from "react";

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
  const latestTranscriptTextRef = useRef("");
  const transcriptPrefixRef = useRef("");
  const activeAnswerRef = useRef(false);
  const isPausedRef = useRef(false);
  const stopResolveRef = useRef<(() => void) | null>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const recognitionConstructor = useMemo(() => getSpeechRecognitionConstructor(), []);
  const browserSupportsSpeechRecognition = recognitionConstructor !== null;

  const createRecognition = () => {
    if (!recognitionConstructor) return null;
    const recognition = new recognitionConstructor();

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = VOICE_LANGUAGE;
    recognition.onstart = () => {
      if (recognitionRef.current !== recognition) return;
      setIsListening(true);
    };
    recognition.onend = () => {
      if (recognitionRef.current !== recognition) return;
      setIsListening(false);
      stopResolveRef.current?.();
      stopResolveRef.current = null;
    };
    recognition.onerror = (event) => {
      if (recognitionRef.current !== recognition) return;
      if (event.error === "not-allowed" || event.error === "service-not-allowed") {
        setIsMicrophoneAvailable(false);
      }

      if (event.error !== "aborted") {
        setIsVoiceStarted(false);
      }
    };
    recognition.onresult = (event) => {
      if (recognitionRef.current !== recognition || isPausedRef.current) return;
      latestTranscriptTextRef.current = [transcriptPrefixRef.current, getTranscriptText(event.results)]
        .filter(Boolean).join(" ");
      setAnswerText(latestTranscriptTextRef.current);
    };

    recognitionRef.current = recognition;
    return recognition;
  };

  useEffect(() => {
    return () => {
      activeAnswerRef.current = false;
      stopResolveRef.current?.();
      stopResolveRef.current = null;
      const recognition = recognitionRef.current;
      recognitionRef.current = null;
      recognition?.abort();
    };
  }, []);

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
    const recognition = createRecognition();

    if (!recognition) {
      setIsVoiceStarted(false);
      return;
    }

    latestTranscriptTextRef.current = "";
    transcriptPrefixRef.current = "";
    activeAnswerRef.current = true;
    isPausedRef.current = false;
    setAnswerText("");
    setIsMicrophoneAvailable(true);

    try {
      recognition.start();
      setIsVoiceStarted(true);
    } catch {
      activeAnswerRef.current = false;
      setIsVoiceStarted(false);
    }
  };

  const handlePauseVoice = () => {
    isPausedRef.current = true;
    transcriptPrefixRef.current = latestTranscriptTextRef.current;
    const recognition = recognitionRef.current;
    recognitionRef.current = null;
    recognition?.abort();
    setIsListening(false);
  };

  const handleResumeVoice = () => {
    if (!activeAnswerRef.current || !isPausedRef.current) return;
    isPausedRef.current = false;
    const recognition = createRecognition();
    try {
      recognition?.start();
    } catch {
      setIsListening(false);
    }
  };

  const handleCompleteVoice = async () => {
    activeAnswerRef.current = false;
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

    const nextAnswerText = saveCurrentTranscript() || currentAnswerText;
    if (recognitionRef.current === recognition) recognitionRef.current = null;
    return nextAnswerText;
  };

  const handleExitVoiceMode = () => {
    activeAnswerRef.current = false;
    const recognition = recognitionRef.current;
    recognitionRef.current = null;
    recognition?.abort();
    setIsListening(false);
    saveCurrentTranscript();
    setIsVoiceStarted(false);
  };

  const handleAnswerTextChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setAnswerText(event.target.value);
  };

  const handleClearAnswer = () => {
    latestTranscriptTextRef.current = "";
    transcriptPrefixRef.current = "";
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
    onPauseVoice: handlePauseVoice,
    onResumeVoice: handleResumeVoice,
    voiceStatus: getVoiceStatus({
      browserSupportsSpeechRecognition,
      isMicrophoneAvailable,
      isListening,
      isVoiceStarted,
    }),
  };
};
