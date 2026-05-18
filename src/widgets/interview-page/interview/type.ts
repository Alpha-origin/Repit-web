import type { RefObject } from "react";
import type { ChangeEvent } from "react";

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
  answerText: string;
  mode: InterviewMode;
  onAnswerTextChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
  onClearAnswer: () => void;
  onModeChange: (mode: InterviewMode) => void;
  onReset: () => void;
  question: InterviewQuestion;
}
