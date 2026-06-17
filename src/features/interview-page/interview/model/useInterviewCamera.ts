import { useEffect, useRef, useState } from "react";

import type { CameraState } from "@/widgets/interview-page/interview/type";

export const useInterviewCamera = (enabled: boolean) => {
  const [cameraState, setCameraState] = useState<CameraState>("loading");
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    let cancelled = false;
    let currentStream: MediaStream | null = null;
    const videoElement = videoRef.current;

    if (!enabled) {
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
  }, [enabled]);

  return {
    cameraState,
    videoRef,
  };
};
