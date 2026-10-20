export const VIDEO_METRICS = ["faceVisibleRatio", "headFacingRatio", "shoulderLevelRatio", "upperBodyStableRatio", "smileShapeRatio"] as const;
export type VideoMetricKey = typeof VIDEO_METRICS[number];
export const VIDEO_EVENTS = {
  FACE_NOT_VISIBLE: "faceVisibleRatio",
  HEAD_TURNED: "headFacingRatio",
  SHOULDER_TILTED: "shoulderLevelRatio",
  UPPER_BODY_MOVEMENT: "upperBodyStableRatio",
} as const;
export type VideoEventType = keyof typeof VIDEO_EVENTS;
export const VIDEO_WARNINGS = ["LOW_SAMPLE_COVERAGE", "MULTIPLE_PEOPLE", "FACE_TOO_SMALL", "LOW_FACE_COVERAGE", "LOW_POSE_COVERAGE", "COMPONENT_FAILURE", "EVENTS_TRUNCATED"] as const;
export type VideoWarning = typeof VIDEO_WARNINGS[number];
export type UnavailableReason = "INSUFFICIENT_DURATION" | "NO_SINGLE_FACE" | "HEAD_POSE_UNAVAILABLE" | "SHOULDERS_NOT_VISIBLE" | "BLENDSHAPES_UNAVAILABLE" | "LOW_COVERAGE";
export interface VideoMetricPair { numeratorMs: number; denominatorMs: number }
export interface VideoMetric extends VideoMetricPair {
  status: "AVAILABLE" | "UNAVAILABLE";
  value: number | null;
  coverageRatio: number;
  unavailableReason: UnavailableReason | null;
}
export interface BehaviorData {
  schemaVersion: "behavior-v1";
  modelVersion: string;
  thresholdsVersion: "behavior-policy-v1";
  videoId: string;
  durationMs: number;
  sampleIntervalMs: 200;
  sampledFrameCount: number;
  sampledDurationMs: number;
  metrics: Record<VideoMetricKey, VideoMetric>;
  timeline: { startMs: number; endMs: number; metrics: Record<VideoMetricKey, VideoMetricPair> }[];
  events: { type: VideoEventType; sourceMetric: VideoMetricKey; startMs: number; endMs: number }[];
  eventsTruncated: boolean;
  summary: string[];
  warnings: VideoWarning[];
}
export const VIDEO_STATUSES = ["NONE", "WAITING", "ANALYZING", "READY", "PARTIAL", "FAILED"] as const;
export type VideoAnalysisStatus = typeof VIDEO_STATUSES[number];
export interface VideoAnalysis {
  status: VideoAnalysisStatus;
  canRetry: boolean;
  reasonCode: string | null;
  behavior: BehaviorData | null;
  latestAnalysisId: string | null;
  behaviorAnalysisId: string | null;
  showingPreviousResult: boolean;
  errorMessage: string | null;
}
