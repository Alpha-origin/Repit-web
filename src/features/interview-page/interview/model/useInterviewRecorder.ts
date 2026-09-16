import { useCallback, useEffect, useRef, useState } from "react";

const VIDEO_MIME_TYPE = "video/mp4";
const MP4_MIME_TYPES = [
  'video/mp4;codecs="avc1.42E01E,mp4a.40.2"',
  VIDEO_MIME_TYPE,
];
const RECORDING_TIMESLICE_MS = 1_000;

interface RecordingSession {
  result: Promise<File | null>;
  stop: () => void;
  dispose: () => void;
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

export const useInterviewRecorder = (
  cloneVideoTrack: () => MediaStreamTrack | null,
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
      console.error("인터뷰 영상 녹화 실패:", error);
    }
  }, []);

  const startRecording = useCallback(async (): Promise<boolean> => {
    if (!isMountedRef.current || startRequestRef.current || sessionRef.current) {
      return false;
    }

    const request = Symbol();
    startRequestRef.current = request;
    setIsStarting(true);
    setErrorMessage(null);
    let stream: MediaStream | null = null;

    try {
      if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
        throw new Error("이 브라우저에서는 카메라와 마이크를 사용할 수 없습니다.");
      }

      const mimeType = typeof MediaRecorder !== "undefined"
        ? MP4_MIME_TYPES.find((type) => MediaRecorder.isTypeSupported(type))
        : undefined;
      if (!mimeType) {
        throw new Error("이 브라우저에서는 MP4 녹화를 지원하지 않습니다. MP4 녹화를 지원하는 브라우저를 사용해주세요.");
      }

      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      if (!isMountedRef.current || startRequestRef.current !== request) {
        stream.getTracks().forEach((track) => track.stop());
        return false;
      }

      // 녹화용 복제 트랙만 종료해 카메라 미리보기의 원본 트랙을 유지한다.
      const videoTrack = cloneVideoTrack();
      if (!videoTrack) {
        throw new Error("카메라가 준비되지 않았습니다. 카메라 연결과 권한을 확인해주세요.");
      }
      stream.addTrack(videoTrack);
      if (!stream.getAudioTracks().some((track) => track.readyState === "live")) {
        throw new Error("마이크 연결을 확인한 뒤 다시 시도해주세요.");
      }

      const recordingStream = stream;
      const recorder = new MediaRecorder(recordingStream, { mimeType });
      const chunks: Blob[] = [];
      let settled = false;
      let resolveResult: (file: File | null) => void = () => {};
      const result = new Promise<File | null>((resolve) => {
        resolveResult = resolve;
      });
      const finish = (file: File | null) => {
        if (settled) return;
        settled = true;
        recorder.ondataavailable = null;
        recorder.onstop = null;
        recorder.onerror = null;
        try {
          if (recorder.state !== "inactive") recorder.stop();
        } catch (error) {
          reportError(error);
        } finally {
          recordingStream.getTracks().forEach((track) => track.stop());
          chunks.length = 0;
          sessionRef.current = null;
          if (isMountedRef.current) {
            setIsRecording(false);
            setIsStopping(false);
            if (file) {
              setVideoFile(file);
              console.log("인터뷰 녹화 videoFile:", file);
            }
          }
          resolveResult(file);
        }
      };

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunks.push(event.data);
      };
      recorder.onstop = () => {
        try {
          const videoBlob = new Blob(chunks, { type: VIDEO_MIME_TYPE });
          if (!videoBlob.size) throw new Error("녹화된 영상이 없습니다. 다시 시도해주세요.");
          finish(new File([videoBlob], `interview-${Date.now()}.mp4`, {
            type: VIDEO_MIME_TYPE,
          }));
        } catch (error) {
          reportError(error);
          finish(null);
        }
      };
      recorder.onerror = () => {
        reportError(new Error("영상 녹화 중 오류가 발생했습니다. 다시 시도해주세요."));
        finish(null);
      };

      sessionRef.current = {
        result,
        stop: () => {
          if (recorder.state === "inactive") return;
          try {
            recorder.stop();
            recordingStream.getTracks().forEach((track) => track.stop());
            if (isMountedRef.current) {
              setIsRecording(false);
              setIsStopping(true);
            }
          } catch (error) {
            reportError(error);
            finish(null);
          }
        },
        dispose: () => finish(null),
      };
      recorder.start(RECORDING_TIMESLICE_MS);
      setVideoFile(null);
      setIsRecording(true);
      return true;
    } catch (error) {
      stream?.getTracks().forEach((track) => track.stop());
      if (startRequestRef.current === request) {
        sessionRef.current?.dispose();
        reportError(error);
      }
      return false;
    } finally {
      if (startRequestRef.current === request) {
        startRequestRef.current = null;
        if (isMountedRef.current) setIsStarting(false);
      }
    }
  }, [cloneVideoTrack, reportError]);

  const stopRecording = useCallback(async (): Promise<File | null> => {
    startRequestRef.current = null;
    if (isMountedRef.current) setIsStarting(false);
    const session = sessionRef.current;
    if (!session) return null;
    session.stop();
    // 마지막 dataavailable 뒤의 stop 이벤트까지 기다려 완성된 파일을 반환한다.
    return session.result;
  }, []);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      startRequestRef.current = null;
      sessionRef.current?.dispose();
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
