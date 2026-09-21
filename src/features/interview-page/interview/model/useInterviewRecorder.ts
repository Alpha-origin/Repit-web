import { useCallback, useEffect, useRef, useState } from "react";

import { convertAudioToMp3 } from "./convertAudioToMp3";
import { createMediaRecording, getSupportedRecordingType } from "./mediaRecording";
import type { MediaRecording } from "./mediaRecording";

const FULL_INTERVIEW_MIME_TYPES = [
  'video/mp4;codecs="avc1.42E01E,mp4a.40.2"',
  "video/mp4",
  "video/webm;codecs=vp9,opus",
  "video/webm;codecs=vp8,opus",
  "video/webm",
];

const ANSWER_MIME_TYPES = [
  "audio/webm;codecs=opus",
  "audio/webm",
  "audio/mp4",
  "audio/ogg;codecs=opus",
];

interface RecordingSession {
  capture: MediaRecording;
  result: Promise<File | null>;
}

interface InterviewRecorderOptions {
  audioOnly?: boolean;
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

const getFileExtension = (mimeType: string, audioOnly: boolean) => {
  if (mimeType.includes("webm")) return "webm";
  if (mimeType.includes("ogg")) return "ogg";
  if (mimeType.includes("mp4")) return "mp4";
  return audioOnly ? "audio" : "video";
};

const createRecordingFile = async (blob: Blob, audioOnly: boolean) => {
  if (audioOnly) {
    try {
      const mp3Blob = await convertAudioToMp3(blob);

      return new File([mp3Blob], `answer-${Date.now()}.mp3`, {
        type: "audio/mpeg",
      });
    } catch (error) {
      // MP3 변환을 지원하지 않는 브라우저에서도 서버가 받을 수 있는 원본 음성을 보낸다.
      console.error("답변 음성 MP3 변환 실패:", error);
    }
  }

  const mimeType = blob.type || (audioOnly ? "audio/webm" : "video/webm");
  const extension = getFileExtension(mimeType, audioOnly);

  return new File([blob], `interview-${Date.now()}.${extension}`, {
    type: mimeType,
  });
};

export const useInterviewRecorder = (
  cloneVideoTrack: () => MediaStreamTrack | null,
  cloneAudioTrack: () => MediaStreamTrack | null,
  { audioOnly = false }: InterviewRecorderOptions = {},
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
      const audioTrack = cloneAudioTrack();
      const mimeType = getSupportedRecordingType(
        audioOnly ? ANSWER_MIME_TYPES : FULL_INTERVIEW_MIME_TYPES,
      );
      const videoTrack = audioOnly ? null : cloneVideoTrack();

      if (!audioOnly && !videoTrack) {
        throw new Error("카메라가 준비되지 않았습니다. 카메라 연결과 권한을 확인해주세요.");
      }

      if (!audioTrack) {
        throw new Error("마이크 연결을 확인한 뒤 다시 시도해주세요.");
      }

      const stream = new MediaStream(
        audioOnly ? [audioTrack] : [audioTrack, videoTrack as MediaStreamTrack],
      );
      const capture = createMediaRecording(stream, mimeType, reportError);
      const result = capture.result
        .then((blob) => (blob ? createRecordingFile(blob, audioOnly) : null))
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
  }, [audioOnly, cloneAudioTrack, cloneVideoTrack, reportError]);

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
