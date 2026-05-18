import { useEffect, useRef, useState } from "react";
import type { ChangeEvent } from "react";
import InterviewCameraView from "@/widgets/interview-page/interview/camera-view";
import InterviewContentView from "@/widgets/interview-page/interview/interview-content";
import * as S from "@/widgets/interview-page/interview/style";
import type {
  CameraState,
  InterviewMode,
  InterviewQuestion,
} from "@/widgets/interview-page/interview/type";

const QUESTION: InterviewQuestion = {
  id: "Q1-1",
  text: "React TypeScript 함께 사용할때 주의해야 할 점은 무엇이라고 생각하나요?",
};

const InterviewPage = () => {
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

      setCameraState("loading");
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
    setMode("voice");
    setAnswerText("");
  };

  const handleAnswerTextChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setAnswerText(event.target.value);
  };

  const handleClearAnswer = () => {
    setAnswerText("");
  };

  const answerStatus =
    mode === "voice" ? "내 답변 보내는 중..." : "텍스트로 답변을 작성해주세요.";

  return (
    <S.Container>
      <S.Content>
        {mode === "voice" && (
          <InterviewCameraView cameraState={cameraState} videoRef={videoRef} />
        )}

        <InterviewContentView
          answerStatus={answerStatus}
          answerText={answerText}
          mode={mode}
          onAnswerTextChange={handleAnswerTextChange}
          onClearAnswer={handleClearAnswer}
          onModeChange={setMode}
          onReset={handleReset}
          question={QUESTION}
        />
      </S.Content>
    </S.Container>
  );
};

export default InterviewPage;
