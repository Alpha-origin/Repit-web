import type { RefObject } from "react";

export type InterviewMode = "text" | "voice";

export type CameraState = "loading" | "ready" | "blocked";

export interface InterviewQuestion {
  id: string;
  text: string;
}

export interface InterviewCameraViewProps {
  cameraState: CameraState;
  videoRef: RefObject<HTMLVideoElement | null>;
}

export interface InterviewContentViewProps {
  answerStatus: string;
  mode: InterviewMode;
  onModeChange: (mode: InterviewMode) => void;
  onReset: () => void;
  question: InterviewQuestion;
}
