import { useCallback, useEffect, useRef, useState } from "react";

import { createMediaRecording, getSupportedRecordingType } from "./mediaRecording";
import type { MediaRecording } from "./mediaRecording";

const VIDEO_MIME_TYPES = [
  'video/mp4;codecs="avc1.42E01E,mp4a.40.2"',
  "video/mp4",
];

interface RecordingSession {
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

  return error instanceof Error ? error.message : "영상 녹화를 시작할 수 없습니다.";
};

const createRecordingFile = (blob: Blob) =>
  new File([blob], `interview-${Date.now()}.mp4`, {
    type: "video/mp4",
  });

export const useInterviewRecorder = (
  cloneVideoTrack: () => MediaStreamTrack | null,
  cloneAudioTrack: () => MediaStreamTrack | null,
) => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [isStopping, setIsStopping] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const sessionRef = useRef<RecordingSession | null>(null);
  const startRequestRef = useRef<symbol | null>(null);
  const isMountedRef = useRef(true);

  const reportError = useCallback((error: unknown) => {
    if (isMountedRef.current) {
      setErrorMessage(getRecordingErrorMessage(error));
    }

    console.error("인터뷰 영상 녹화 실패:", error);
  }, []);

  const startRecording = useCallback(async (): Promise<boolean> => {
    if (!isMountedRef.current || startRequestRef.current || sessionRef.current) {
      return false;
    }

    const request = Symbol();
    startRequestRef.current = request;
    setIsStarting(true);
    setErrorMessage(null);

    try {
      const mimeType = getSupportedRecordingType(VIDEO_MIME_TYPES);
      const videoTrack = cloneVideoTrack();
      const audioTrack = cloneAudioTrack();

      if (!videoTrack) {
        throw new Error("카메라가 준비되지 않았습니다. 카메라 연결과 권한을 확인해주세요.");
      }

      if (!audioTrack) {
        throw new Error("마이크 연결을 확인한 뒤 다시 시도해주세요.");
      }

      const stream = new MediaStream([audioTrack, videoTrack]);
      const capture = createMediaRecording(stream, mimeType, reportError);
      const result = capture.result
        .then((blob) => (blob ? createRecordingFile(blob) : null))
        .catch((error: unknown) => {
          reportError(error);
          return null;
        })
        .finally(() => {
          sessionRef.current = null;

          if (isMountedRef.current) {
            setIsRecording(false);
            setIsStopping(false);
          }
        });

      sessionRef.current = { capture, result };
      setVideoFile(null);
      setIsRecording(true);
      return true;
    } catch (error) {
      if (startRequestRef.current === request) {
        reportError(error);
      }

      return false;
    } finally {
      if (startRequestRef.current === request) {
        startRequestRef.current = null;

        if (isMountedRef.current) {
          setIsStarting(false);
        }
      }
    }
  }, [cloneAudioTrack, cloneVideoTrack, reportError]);

  const stopRecording = useCallback(async (): Promise<File | null> => {
    startRequestRef.current = null;

    if (isMountedRef.current) {
      setIsStarting(false);
    }

    const session = sessionRef.current;

    if (!session) {
      return null;
    }

    if (isMountedRef.current) {
      setIsRecording(false);
      setIsStopping(true);
    }

    // 마지막 dataavailable 이후 생성된 파일까지 기다린다.
    await session.capture.stop();
    const file = await session.result;

    if (file && isMountedRef.current) {
      setVideoFile(file);
    }

    return file;
  }, []);

  useEffect(() => {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;
      startRequestRef.current = null;
      void sessionRef.current?.capture.stop();
    };
  }, []);

  return {
    videoFile,
    errorMessage,
    isRecording,
    isStarting,
    isStopping,
    startRecording,
    stopRecording,
  };
};

export type InterviewRecorder = ReturnType<typeof useInterviewRecorder>;
