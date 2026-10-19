import { useMediaRecorder } from "./useMediaRecorder";

export const useInterviewRecorder = (
  cloneVideoTrack: () => MediaStreamTrack | null,
  cloneAudioTrack: () => MediaStreamTrack | null,
) => useMediaRecorder("video", cloneAudioTrack, cloneVideoTrack);
