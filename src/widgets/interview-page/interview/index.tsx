import { useEffect, useRef, useState } from "react";
import InterviewCameraView from "./camera-view";
import InterviewContentView from "./interview-content";
import * as S from "./style";
import type { CameraState, InterviewMode, InterviewQuestion } from "./type";

const QUESTION: InterviewQuestion = {
  id: "Q1-1",
  text: "React TypeScript 함께 사용할때 주의해야 할 점은 무엇이라고 생각하나요?",
};

const Interview = () => {
  const [mode, setMode] = useState<InterviewMode>("voice");
  const [cameraState, setCameraState] = useState<CameraState>("loading");
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    let cancelled = false;
    let currentStream: MediaStream | null = null;
    const videoElement = videoRef.current;

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
  }, []);

  const handleReset = () => {
    setMode("voice");
  };

  const answerStatus =
    mode === "voice" ? "내 답변 보내는 중..." : "텍스트 답변을 입력할 수 있어요.";

  return (
    <S.Container>
      <S.Content>
        <InterviewCameraView cameraState={cameraState} videoRef={videoRef} />
        <InterviewContentView
          answerStatus={answerStatus}
          mode={mode}
          onModeChange={setMode}
          onReset={handleReset}
          question={QUESTION}
        />
      </S.Content>
    </S.Container>
  );
};

export default Interview;
