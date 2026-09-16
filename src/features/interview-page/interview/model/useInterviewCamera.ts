import { useCallback, useEffect, useRef, useState } from "react";

import type { CameraState } from "@/widgets/interview-page/interview/type";

export const useInterviewCamera = (enabled: boolean) => {
  const [cameraState, setCameraState] = useState<CameraState>("loading");
  const videoElementRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const cloneVideoTrack = useCallback(() => {
    const track = streamRef.current?.getVideoTracks()[0];
    return track?.readyState === "live" ? track.clone() : null;
  }, []);
  const attachStream = useCallback((stream: MediaStream) => {
    const videoElement = videoElementRef.current;

    if (!videoElement) {
      return;
    }

    videoElement.srcObject = stream;
    void videoElement.play().catch(() => {});
  }, []);
  const videoRef = useCallback(
    (videoElement: HTMLVideoElement | null) => {
      videoElementRef.current = videoElement;

      if (videoElement && streamRef.current) {
        attachStream(streamRef.current);
      }
    },
    [attachStream],
  );

  useEffect(() => {
    let cancelled = false;
    let currentStream: MediaStream | null = null;

    if (!enabled) {
      if (videoElementRef.current) {
        videoElementRef.current.srcObject = null;
      }

      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
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
        streamRef.current = stream;
        attachStream(stream);

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

      if (videoElementRef.current?.srcObject === currentStream) {
        videoElementRef.current.srcObject = null;
      }

      if (streamRef.current === currentStream) {
        streamRef.current = null;
      }
      currentStream?.getTracks().forEach((track) => track.stop());
    };
  }, [attachStream, enabled]);

  return {
    cameraState,
    cloneVideoTrack,
    videoRef,
  };
};
