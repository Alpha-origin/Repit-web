export type InterviewMode = "text" | "voice";

export type CameraState = "loading" | "ready" | "blocked";
export type MicState = "loading" | "ready" | "blocked";
export type QuestionAudioStatus = "idle" | "loading" | "playing" | "blocked" | "failed";

export interface InterviewQuestion {
  id: string;
  text: string;
}
