export interface MediaRecording {
  result: Promise<Blob | null>;
  stop: () => Promise<Blob | null>;
}

export const getSupportedRecordingType = (types: string[]) => {
  const mimeType = typeof MediaRecorder !== "undefined"
    ? types.find((type) => MediaRecorder.isTypeSupported(type))
    : undefined;
  if (!mimeType) throw new Error("이 브라우저에서는 요청한 녹화 형식을 지원하지 않습니다.");
  return mimeType;
};

// 전달받은 스트림은 이 녹화만 소유한다. 카메라 원본은 복제해서 전달한다.
export const createMediaRecording = (
  stream: MediaStream,
  mimeType: string,
  onError: (error: unknown) => void,
): MediaRecording => {
  const release = () => stream.getTracks().forEach((track) => track.stop());
  try {
    const recorder = new MediaRecorder(stream, { mimeType });
    const chunks: Blob[] = [];
    let settled = false;
    let resolveResult: (blob: Blob | null) => void = () => {};
    const result = new Promise<Blob | null>((resolve) => { resolveResult = resolve; });
    const finish = (blob: Blob | null) => {
      if (settled) return;
      settled = true;
      recorder.ondataavailable = null;
      recorder.onstop = null;
      recorder.onerror = null;
      try {
        if (recorder.state !== "inactive") recorder.stop();
      } catch (error) {
        onError(error);
      } finally {
        release();
        chunks.length = 0;
        resolveResult(blob);
      }
    };
    recorder.ondataavailable = (event) => {
      if (event.data.size) chunks.push(event.data);
    };
    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: recorder.mimeType || mimeType });
      if (!blob.size) onError(new Error("녹화된 데이터가 없습니다. 다시 시도해주세요."));
      finish(blob.size ? blob : null);
    };
    recorder.onerror = () => {
      onError(new Error("녹화 중 오류가 발생했습니다. 장치 연결을 확인해주세요."));
      finish(null);
    };
    try {
      recorder.start(1_000);
    } catch (error) {
      finish(null);
      throw error;
    }
    return {
      result,
      stop: () => {
        if (!settled && recorder.state !== "inactive") {
          try {
            recorder.stop();
            release();
          } catch (error) {
            onError(error);
            finish(null);
          }
        }
        // stop 이벤트 전에 전달되는 마지막 청크까지 포함한다.
        return result;
      },
    };
  } catch (error) {
    release();
    throw error;
  }
};
