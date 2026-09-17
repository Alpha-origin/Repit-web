import { useCallback, useEffect, useRef, useState } from "react";

import { convertAudioToMp3 } from "./convertAudioToMp3";
import { useInterviewRecordingStore } from "./interviewRecordingStore";
import { createMediaRecording, getSupportedRecordingType } from "./mediaRecording";
import type { MediaRecording } from "./mediaRecording";

interface FileRecording {
  capture: MediaRecording;
  result: Promise<File | null>;
}

const getRecordingErrorMessage = (error: unknown) => {
  if (error instanceof DOMException && error.name === "NotAllowedError") {
    return "카메라와 마이크 권한을 허용한 뒤 다시 시도해주세요.";
  }
  if (error instanceof DOMException && error.name === "NotFoundError") {
    return "사용할 수 있는 카메라 또는 마이크를 찾을 수 없습니다.";
  }
  return error instanceof Error ? error.message : "녹화 중 오류가 발생했습니다.";
};

export const useInterviewRecorder = (cloneVideoTrack: () => MediaStreamTrack | null) => {
  const videoFile = useInterviewRecordingStore((state) => state.videoFile);
  const audioFiles = useInterviewRecordingStore((state) => state.audioFiles);
  const [isVideoRecording, setIsVideoRecording] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [isStopping, setIsStopping] = useState(false);
  const [videoError, setVideoError] = useState<string | null>(null);
  const [audioError, setAudioError] = useState<string | null>(null);
  const recordingIdRef = useRef(Date.now());
  const videoRef = useRef<FileRecording | null>(null);
  const audioRef = useRef<FileRecording | null>(null);
  const videoStartedRef = useRef(false);
  const audioIndexRef = useRef(0);
  const startRequestRef = useRef<symbol | null>(null);
  const mountedRef = useRef(true);
  const closedRef = useRef(false);
  const finishRef = useRef<Promise<void> | null>(null);

  const reportVideoError = useCallback((error: unknown) => {
    if (mountedRef.current) setVideoError(getRecordingErrorMessage(error));
    console.error("인터뷰 영상 녹화 실패:", error);
  }, []);
  const reportAudioError = useCallback((error: unknown) => {
    if (mountedRef.current) setAudioError(getRecordingErrorMessage(error));
    console.error("인터뷰 음성 녹음 실패:", error);
  }, []);

  const startVideoRecording = useCallback(() => {
    if (closedRef.current || videoStartedRef.current || !mountedRef.current) return;
    let stream: MediaStream | null = null;
    try {
      const mimeType = getSupportedRecordingType([
        'video/mp4;codecs="avc1.42E01E"', "video/mp4",
      ]);
      const track = cloneVideoTrack();
      if (!track) throw new Error("카메라 연결과 권한을 확인해주세요.");
      // 음성 트랙 없이 카메라 복제 트랙 하나만 전체 면접 동안 녹화한다.
      stream = new MediaStream([track]);
      const capture = createMediaRecording(stream, mimeType, reportVideoError);
      const recordingId = recordingIdRef.current;
      useInterviewRecordingStore.getState().begin(recordingId);
      videoStartedRef.current = true;
      setIsVideoRecording(true);
      setVideoError(null);
      const result = capture.result.then((blob) => {
        if (!blob) return null;
        const file = new File([blob], `interview-${recordingId}.mp4`, { type: "video/mp4" });
        useInterviewRecordingStore.getState().setVideoFile(recordingId, file);
        console.log("인터뷰 전체 무음 videoFile:", file);
        return file;
      }).catch((error: unknown) => {
        reportVideoError(error);
        return null;
      }).finally(() => {
        if (mountedRef.current) setIsVideoRecording(false);
      });
      videoRef.current = { capture, result };
    } catch (error) {
      stream?.getTracks().forEach((track) => track.stop());
      reportVideoError(error);
    }
  }, [cloneVideoTrack, reportVideoError]);

  const startAudioRecording = useCallback(async (): Promise<boolean> => {
    if (closedRef.current || startRequestRef.current || audioRef.current || !mountedRef.current) {
      return false;
    }
    const request = Symbol();
    startRequestRef.current = request;
    setIsStarting(true);
    setAudioError(null);
    let stream: MediaStream | null = null;
    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error("이 브라우저에서는 마이크를 사용할 수 없습니다.");
      }
      if (typeof OfflineAudioContext === "undefined" || typeof Worker === "undefined") {
        throw new Error("이 브라우저에서는 MP3 변환을 지원하지 않습니다.");
      }
      const mimeType = getSupportedRecordingType([
        "audio/webm;codecs=opus", "audio/webm", "audio/mp4",
      ]);
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      if (closedRef.current || !mountedRef.current || startRequestRef.current !== request) {
        stream.getTracks().forEach((track) => track.stop());
        return false;
      }
      const capture = createMediaRecording(stream, mimeType, reportAudioError);
      const recordingId = recordingIdRef.current;
      const index = ++audioIndexRef.current;
      useInterviewRecordingStore.getState().begin(recordingId);
      const result = capture.result.then(async (blob) => {
        if (mountedRef.current) {
          setIsRecording(false);
          setIsStopping(true);
        }
        if (!blob) return null;
        const mp3Blob = await convertAudioToMp3(blob);
        const file = new File([mp3Blob], `interview-${recordingId}-answer-${index}.mp3`, {
          type: "audio/mpeg",
        });
        useInterviewRecordingStore.getState().addAudioFile(recordingId, file);
        console.log("인터뷰 답변 audioFile:", file);
        return file;
      }).catch((error: unknown) => {
        reportAudioError(error);
        return null;
      }).finally(() => {
        audioRef.current = null;
        if (mountedRef.current) {
          setIsRecording(false);
          setIsStopping(false);
        }
      });
      audioRef.current = { capture, result };
      setIsRecording(true);
      return true;
    } catch (error) {
      stream?.getTracks().forEach((track) => track.stop());
      if (startRequestRef.current === request) reportAudioError(error);
      return false;
    } finally {
      if (startRequestRef.current === request) {
        startRequestRef.current = null;
        if (mountedRef.current) setIsStarting(false);
      }
    }
  }, [reportAudioError]);

  const stopAudioRecording = useCallback(async (): Promise<File | null> => {
    startRequestRef.current = null;
    if (mountedRef.current) setIsStarting(false);
    const audio = audioRef.current;
    if (!audio) return null;
    void audio.capture.stop();
    if (mountedRef.current) {
      setIsRecording(false);
      setIsStopping(true);
    }
    return audio.result;
  }, []);

  const finishInterviewRecording = useCallback((): Promise<void> => {
    if (finishRef.current) return finishRef.current;
    closedRef.current = true;
    // 두 장치는 즉시 정지하고 마지막 청크 및 MP3 인코딩 완료 후 이동한다.
    const audioResult = stopAudioRecording();
    const video = videoRef.current;
    void video?.capture.stop();
    finishRef.current = Promise.all([audioResult, video?.result]).then(() => {
      const files = useInterviewRecordingStore.getState();
      if (files.recordingId === recordingIdRef.current) {
        console.log("인터뷰 녹화 파일:", {
          videoFile: files.videoFile,
          audioFiles: files.audioFiles,
        });
      }
    });
    return finishRef.current;
  }, [stopAudioRecording]);

  useEffect(() => {
    mountedRef.current = true;
    closedRef.current = false;
    finishRef.current = null;
    return () => {
      mountedRef.current = false;
      void finishInterviewRecording();
    };
  }, [finishInterviewRecording]);

  return {
    videoFile,
    audioFiles,
    isVideoRecording,
    isRecording,
    isStarting,
    isStopping,
    errorMessage: [videoError, audioError].filter(Boolean).join(" ") || null,
    startVideoRecording,
    startAudioRecording,
    stopAudioRecording,
    finishInterviewRecording,
  };
};
