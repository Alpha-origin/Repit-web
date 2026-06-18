import type { RefObject } from "react";
import type { ChangeEvent } from "react";

export type InterviewMode = "text" | "voice";

export type CameraState = "loading" | "ready" | "blocked";
export type QuestionAudioStatus = "idle" | "loading" | "playing";

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
  isVoiceStarted: boolean;
  mode: InterviewMode;
  questionAudioStatus: QuestionAudioStatus;
  onAnswerTextChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
  onClearAnswer: () => void;
  onCompleteVoice: () => void;
  onModeChange: (mode: InterviewMode) => void;
  onStartVoice: () => void;
  onSubmitText: () => void;
  onToggleQuestionAudio: () => void;
  question: InterviewQuestion;
  voiceLevel: number;
}
