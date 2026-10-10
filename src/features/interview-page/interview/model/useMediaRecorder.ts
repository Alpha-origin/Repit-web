import { useCallback, useEffect, useRef, useState } from "react";
import { createMediaRecording, getSupportedRecordingType } from "./mediaRecording";
import type { MediaRecording } from "./mediaRecording";

type RecordingKind = "audio" | "video";
const MIME_TYPES = {
  video: ['video/mp4;codecs="avc1.42E01E,mp4a.40.2"', "video/mp4", "video/webm;codecs=vp8,opus", "video/webm"],
  audio: ["audio/webm;codecs=opus", "audio/webm", "audio/mp4", "audio/ogg;codecs=opus"],
};

export const useMediaRecorder = (
  kind: RecordingKind,
  cloneAudioTrack: () => MediaStreamTrack | null,
  cloneVideoTrack?: () => MediaStreamTrack | null,
) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [isStopping, setIsStopping] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const sessionRef = useRef<MediaRecording | null>(null);
  const stoppingRef = useRef(false);
  const mountedRef = useRef(true);
  const reportError = useCallback((error: unknown) => {
    if (mountedRef.current) {
      setErrorMessage(error instanceof Error ? error.message : "녹화 중 오류가 발생했습니다.");
    }
  }, []);

  const startRecording = useCallback(() => {
    if (!mountedRef.current || sessionRef.current || stoppingRef.current) return false;
    const tracks: MediaStreamTrack[] = [];
    setIsStarting(true);
    setErrorMessage(null);
    try {
      const mimeType = getSupportedRecordingType(MIME_TYPES[kind]);
      const audioTrack = cloneAudioTrack();
      if (!audioTrack) throw new Error("마이크 연결과 권한을 확인해주세요. 텍스트 면접은 사전설정에서 선택할 수 있습니다.");
      tracks.push(audioTrack);
      if (kind === "video") {
        const videoTrack = cloneVideoTrack?.();
        if (!videoTrack) throw new Error("카메라 연결과 권한을 확인해주세요.");
        tracks.push(videoTrack);
      }
      const capture = createMediaRecording(new MediaStream(tracks), mimeType, reportError, {
        audioBitsPerSecond: 128_000,
        ...(kind === "video" ? { videoBitsPerSecond: 1_000_000 } : {}),
      });
      sessionRef.current = capture;
      setIsRecording(true);
      void capture.result.then(() => {
        if (sessionRef.current === capture) sessionRef.current = null;
        if (mountedRef.current) setIsRecording(false);
      });
      return true;
    } catch (error) {
      tracks.forEach((track) => track.stop());
      reportError(error);
      return false;
    } finally {
      setIsStarting(false);
    }
  }, [cloneAudioTrack, cloneVideoTrack, kind, reportError]);

  const stopRecording = useCallback(async (): Promise<File | null> => {
    const capture = sessionRef.current;
    if (!capture) return null;
    sessionRef.current = null;
    stoppingRef.current = true;
    if (mountedRef.current) {
      setIsRecording(false);
      setIsStopping(true);
    }
    try {
      const blob = await capture.stop();
      if (!blob) return null;
      const mimeType = blob.type.split(";")[0];
      const extension = mimeType.endsWith("mp4") ? (kind === "audio" ? "m4a" : "mp4")
        : mimeType.endsWith("ogg") ? "ogg" : "webm";
      return new File([blob], `${kind}-${Date.now()}.${extension}`, { type: blob.type });
    } finally {
      stoppingRef.current = false;
      if (mountedRef.current) setIsStopping(false);
    }
  }, [kind]);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      void sessionRef.current?.stop();
    };
  }, []);

  return { errorMessage, isRecording, isStarting, isStopping, startRecording, stopRecording };
};
