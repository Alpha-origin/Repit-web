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
  const [isCameraEnabled, setIsCameraEnabled] = useState(true);
  const [isMicEnabled, setIsMicEnabled] = useState(true);
  const videoElementRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recordingTracksRef = useRef(new Set<MediaStreamTrack>());
  const deviceEnabledRef = useRef({ audio: true, video: true });
  const cloneTrack = useCallback((track?: MediaStreamTrack) => {
    if (track?.readyState !== "live") return null;
    for (const recordingTrack of recordingTracksRef.current) {
      if (recordingTrack.readyState === "ended") recordingTracksRef.current.delete(recordingTrack);
    }
    const clone = track.clone();
    clone.enabled = track.enabled;
    recordingTracksRef.current.add(clone);
    return clone;
  }, []);
  const cloneVideoTrack = useCallback(() => {
    return cloneTrack(streamRef.current?.getVideoTracks()[0]);
  }, [cloneTrack]);
  const cloneAudioTrack = useCallback(() => {
    return cloneTrack(streamRef.current?.getAudioTracks()[0]);
  }, [cloneTrack]);
  const toggleTrack = useCallback((kind: "audio" | "video") => {
    const track = streamRef.current?.getTracks().find((item) => item.kind === kind && item.readyState === "live");
    if (!track) return null;
    const nextEnabled = !track.enabled;
    deviceEnabledRef.current[kind] = nextEnabled;
    // 녹음·녹화는 원본의 복제 트랙을 쓰므로 진행 중인 모든 복제본도 함께 전환한다.
    for (const item of [...(streamRef.current?.getTracks() ?? []), ...recordingTracksRef.current]) {
      if (item.readyState === "ended") recordingTracksRef.current.delete(item);
      else if (item.kind === kind) item.enabled = nextEnabled;
    }
    if (kind === "video") setIsCameraEnabled(nextEnabled);
    else setIsMicEnabled(nextEnabled);
    return nextEnabled;
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

  const releaseMedia = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    if (videoElementRef.current) videoElementRef.current.srcObject = null;
  }, []);

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
        stream.getAudioTracks().forEach((track) => { track.enabled = deviceEnabledRef.current.audio; });
        stream.getVideoTracks().forEach((track) => { track.enabled = deviceEnabledRef.current.video; });
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
    releaseMedia,
    cloneAudioTrack,
    cloneVideoTrack,
    micState,
    isCameraEnabled,
    isMicEnabled,
    toggleCamera: () => toggleTrack("video"),
    toggleMicrophone: () => toggleTrack("audio"),
    micStream,
    videoRef,
  };
};
