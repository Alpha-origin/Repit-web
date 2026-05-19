import { useEffect, useRef, useState } from "react";
import type { ChangeEvent } from "react";

import { INTERVIEW_STATUS_MESSAGES } from "@/shared/constants/interview-page/interview";

import type { CameraState, InterviewMode } from "@/widgets/interview-page/interview/type";

export const useInterviewSession = () => {
  const [mode, setMode] = useState<InterviewMode>("voice");
  const [cameraState, setCameraState] = useState<CameraState>("loading");
  const [answerText, setAnswerText] = useState("");
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    let cancelled = false;
    let currentStream: MediaStream | null = null;
    const videoElement = videoRef.current;

    if (mode !== "voice") {
      if (videoElement) {
        videoElement.srcObject = null;
      }
      return;
    }

    const attachCamera = async () => {
      if (!navigator.mediaDevices?.getUserMedia) {
        if (!cancelled) {
          setCameraState("blocked");
        }
        return;
      }

      setCameraState("loading");

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "user",
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        });

        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        currentStream = stream;

        if (videoElement) {
          videoElement.srcObject = stream;
          void videoElement.play().catch(() => {});
        }

        setCameraState("ready");
      } catch {
        if (!cancelled) {
          setCameraState("blocked");
        }
      }
    };

    void attachCamera();

    return () => {
      cancelled = true;

      if (videoElement) {
        videoElement.srcObject = null;
      }

      currentStream?.getTracks().forEach((track) => track.stop());
    };
  }, [mode]);

  const handleReset = () => {
    if (mode !== "voice") {
      setCameraState("loading");
    }

    setMode("voice");
    setAnswerText("");
  };

  const handleModeChange = (nextMode: InterviewMode) => {
    if (nextMode === mode) {
      return;
    }

    setCameraState("loading");
    setMode(nextMode);
  };

  const handleAnswerTextChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setAnswerText(event.target.value);
  };

  const handleClearAnswer = () => {
    setAnswerText("");
  };

  const answerStatus =
    mode === "voice"
      ? INTERVIEW_STATUS_MESSAGES.voice
      : INTERVIEW_STATUS_MESSAGES.text;

  return {
    answerStatus,
    answerText,
    cameraState,
    mode,
    onAnswerTextChange: handleAnswerTextChange,
    onClearAnswer: handleClearAnswer,
    onModeChange: handleModeChange,
    onReset: handleReset,
    videoRef,
  };
};
