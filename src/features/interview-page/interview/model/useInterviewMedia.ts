import { useCallback, useEffect, useRef, useState } from "react";

import type { CameraState, MicState } from "@/widgets/interview-page/interview/type";

const VIDEO_CONSTRAINTS: MediaTrackConstraints = {
  facingMode: "user",
  width: { ideal: 1280 },
  height: { ideal: 720 },
};

// 자동 게인을 끄지 않으면 조용할 때도 입력이 증폭돼 마이크 게이지가 계속 차 보인다.
const AUDIO_CONSTRAINTS: MediaTrackConstraints = {
  echoCancellation: true,
  noiseSuppression: true,
  autoGainControl: false,
};

export const useInterviewMedia = (enabled: boolean) => {
  const [cameraState, setCameraState] = useState<CameraState>("loading");
  const [micState, setMicState] = useState<MicState>("loading");
  const [micStream, setMicStream] = useState<MediaStream | null>(null);
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

    const requestMediaStream = async () => {
      try {
        return await navigator.mediaDevices.getUserMedia({
          video: VIDEO_CONSTRAINTS,
          audio: AUDIO_CONSTRAINTS,
        });
      } catch {
        // 마이크만 거부된 경우에도 카메라 미리보기는 살려둔다.
        return navigator.mediaDevices.getUserMedia({
          video: VIDEO_CONSTRAINTS,
          audio: false,
        });
      }
    };

    const attachMedia = async () => {
      if (!navigator.mediaDevices?.getUserMedia) {
        if (!cancelled) {
          setCameraState("blocked");
          setMicState("blocked");
        }
        return;
      }

      setCameraState("loading");
      setMicState("loading");

      try {
        const stream = await requestMediaStream();

        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        currentStream = stream;
        streamRef.current = stream;
        attachStream(stream);

        const audioTracks = stream.getAudioTracks();

        // 음량 측정용으로는 오디오 트랙만 따로 묶어 전달해야 카메라 재연결에 영향받지 않는다.
        setMicStream(audioTracks.length > 0 ? new MediaStream(audioTracks) : null);
        setMicState(audioTracks.length > 0 ? "ready" : "blocked");
        setCameraState("ready");
      } catch {
        if (!cancelled) {
          setCameraState("blocked");
          setMicState("blocked");
          setMicStream(null);
        }
      }
    };

    void attachMedia();

    return () => {
      cancelled = true;

      if (videoElementRef.current?.srcObject === currentStream) {
        videoElementRef.current.srcObject = null;
      }

      if (streamRef.current === currentStream) {
        streamRef.current = null;
      }

      setMicStream(null);
      currentStream?.getTracks().forEach((track) => track.stop());
    };
  }, [attachStream, enabled]);

  return {
    cameraState,
    cloneVideoTrack,
    micState,
    micStream,
    videoRef,
  };
};
