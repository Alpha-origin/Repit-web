import { create } from "zustand";

interface InterviewRecordingState {
  recordingId: number | null;
  videoFile: File | null;
  audioFiles: File[];
  begin: (recordingId: number) => void;
  setVideoFile: (recordingId: number, file: File) => void;
  addAudioFile: (recordingId: number, file: File) => void;
}

// 최근 면접 파일을 메모리에만 보관한다. 다음 면접을 시작하면 교체한다.
export const useInterviewRecordingStore = create<InterviewRecordingState>((set) => ({
  recordingId: null,
  videoFile: null,
  audioFiles: [],
  begin: (recordingId) => set((state) => state.recordingId === recordingId
    ? state
    : { recordingId, videoFile: null, audioFiles: [] }),
  setVideoFile: (recordingId, videoFile) => set((state) =>
    state.recordingId === recordingId ? { videoFile } : state),
  addAudioFile: (recordingId, file) => set((state) =>
    state.recordingId === recordingId ? { audioFiles: [...state.audioFiles, file] } : state),
}));
