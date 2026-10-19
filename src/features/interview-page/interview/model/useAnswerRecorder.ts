import { useMediaRecorder } from "./useMediaRecorder";

export const useAnswerRecorder = (cloneAudioTrack: () => MediaStreamTrack | null) =>
  useMediaRecorder("audio", cloneAudioTrack);
