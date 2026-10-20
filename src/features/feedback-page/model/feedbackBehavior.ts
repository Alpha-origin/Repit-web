import type { BehaviorData, UnavailableReason, VideoAnalysis, VideoEventType, VideoMetricKey, VideoWarning } from "./videoAnalysisTypes";
import { VIDEO_METRICS } from "./videoAnalysisTypes";

export const VIDEO_LABELS: Record<VideoMetricKey, { title: string; description: string; summary: string }> = {
  faceVisibleRatio: { title: "얼굴 관찰", description: "얼굴이 한 명 관찰된 시간의 비율", summary: "얼굴이 관찰된 구간은 판단 가능한 시간의" },
  headFacingRatio: { title: "정면 방향 추정", description: "머리가 카메라 정면 범위로 추정된 비율. 실제 눈동자 시선과 다릅니다.", summary: "머리가 카메라 정면 방향으로 추정된 구간은 방향을 판단할 수 있는 시간의" },
  shoulderLevelRatio: { title: "어깨 수평 관찰", description: "양쪽 어깨선이 설정 범위에서 수평인 비율", summary: "어깨선이 수평 범위에 있던 구간은 어깨를 관찰할 수 있는 시간의" },
  upperBodyStableRatio: { title: "상체 안정 구간", description: "상체 중심 이동이 설정 기준 이하인 비율", summary: "상체 중심 이동이 기준 이하인 구간은 움직임을 판단할 수 있는 시간의" },
  smileShapeRatio: { title: "미소 형태 관찰", description: "미소와 비슷한 입꼬리 형태. 말하는 입 모양과 혼동될 수 있습니다.", summary: "미소와 비슷한 입꼬리 형태가 관찰된 구간은 측정 가능 시간의" },
};
export const UNAVAILABLE_MESSAGES: Record<UnavailableReason, string> = {
  INSUFFICIENT_DURATION: "영상 길이가 10초 미만입니다.",
  NO_SINGLE_FACE: "얼굴이 한 명인 구간을 관찰하지 못했습니다.",
  HEAD_POSE_UNAVAILABLE: "머리 방향을 판단할 수 있는 구간이 없습니다.",
  SHOULDERS_NOT_VISIBLE: "양쪽 어깨를 관찰할 수 있는 구간이 부족합니다.",
  BLENDSHAPES_UNAVAILABLE: "입꼬리 형태를 측정할 수 있는 구간이 부족합니다.",
  LOW_COVERAGE: "측정 가능한 시간이나 관찰 범위가 부족합니다.",
};
export const EVENT_MESSAGES: Record<VideoEventType, string> = {
  FACE_NOT_VISIBLE: "얼굴을 관찰하지 못한 구간",
  HEAD_TURNED: "정면 방향 범위를 벗어난 구간",
  SHOULDER_TILTED: "어깨선 기울기가 관찰된 구간",
  UPPER_BODY_MOVEMENT: "상체 중심 이동이 관찰된 구간",
};
export const WARNING_MESSAGES: Record<VideoWarning, string> = {
  LOW_SAMPLE_COVERAGE: "전체 영상 중 관찰한 구간의 범위가 부족합니다.",
  MULTIPLE_PEOPLE: "여러 인물이 관찰된 구간은 대상이 불확실해 집계에서 제외했습니다.",
  FACE_TOO_SMALL: "얼굴이 작게 보인 일부 구간은 방향 추정에서 제외했습니다.",
  LOW_FACE_COVERAGE: "머리 방향 또는 입꼬리 형태의 관찰 범위가 부족합니다.",
  LOW_POSE_COVERAGE: "어깨 또는 상체의 관찰 범위가 부족합니다.",
  COMPONENT_FAILURE: "분석기 일부가 동작하지 않아 측정 가능한 항목만 제공합니다.",
  EVENTS_TRUNCATED: "앞부분 관찰 구간 최대 60개를 표시합니다.",
};
const REASON_MESSAGES: Record<string, string> = {
  SERVICE_DISABLED: "영상 행동 관찰 기능을 준비 중입니다.",
  NO_RECORDING: "분석할 면접 영상이 없습니다.",
  UPLOADED_BEFORE_ENABLED: "이 영상은 행동 관찰 기능이 적용되기 전에 업로드되었습니다.",
  SOURCE_EXPIRED: "이 영상은 다시 분석할 수 있는 보관 기간이 지났습니다.",
  RESULT_SCHEMA_UNSUPPORTED: "이 결과는 현재 화면에서 지원하지 않는 형식입니다.",
  BEHAVIOR_NOT_MEASURABLE: "행동 지표를 측정할 수 있는 구간이 충분하지 않습니다.",
  ANALYZER_NOT_CONFIGURED: "영상 행동 분석기가 아직 준비되지 않았습니다.",
  SOURCE_ACCESS_DENIED_OR_EXPIRED: "영상 파일에 접근할 수 없습니다.",
  PROCESSING_TIMEOUT: "영상 분석이 제한 시간 안에 완료되지 않았습니다.",
  PROCESSING_OVERDUE: "영상 분석이 제한 시간 안에 완료되지 않았습니다.",
  RESULT_EXPIRED: "영상 분석 결과의 보관 기간이 지났습니다.",
  INVALID_RESULT: "영상 분석 결과를 확인하지 못했습니다.",
};
const STATUS_MESSAGES: Record<VideoAnalysis["status"], string> = {
  NONE: "제공할 수 있는 영상 행동 관찰 정보가 없습니다.",
  WAITING: "영상 분석을 기다리고 있습니다. 업로드 완료 후 잠시 시간이 걸릴 수 있습니다.",
  ANALYZING: "영상 행동을 분석하고 있습니다. 완료되면 자동으로 표시됩니다.",
  READY: "관찰 완료",
  PARTIAL: "일부 관찰 완료. 측정 가능한 항목만 표시합니다.",
  FAILED: "영상 행동 분석을 완료하지 못했습니다.",
};
export const videoStatusMessage = (data: VideoAnalysis) =>
  (data.status === "FAILED" && data.errorMessage) ||
  (data.reasonCode && REASON_MESSAGES[data.reasonCode]) || STATUS_MESSAGES[data.status];
export const formatVideoPercent = (value: number) => `${(Math.round(value * 1000) / 10).toFixed(1)}%`;
export const formatVideoDuration = (ms: number) => `${(Math.round(ms / 100) / 10).toFixed(1)}초`;
export const formatVideoTime = (ms: number, end = false) => {
  const seconds = end ? Math.ceil(ms / 1000) : Math.floor(ms / 1000);
  const pad = (n: number) => String(n).padStart(2, "0");
  return seconds >= 3600 ? `${pad(Math.floor(seconds / 3600))}:${pad(Math.floor(seconds / 60) % 60)}:${pad(seconds % 60)}` : `${pad(Math.floor(seconds / 60))}:${pad(seconds % 60)}`;
};
export const behaviorSummaries = (data: BehaviorData) => VIDEO_METRICS
  .filter((key) => data.metrics[key].status === "AVAILABLE")
  .slice(0, 3)
  .map((key) => `${VIDEO_LABELS[key].summary} ${formatVideoPercent(data.metrics[key].value!)}입니다.`);
