import { VIDEO_EVENTS, VIDEO_METRICS, VIDEO_STATUSES, VIDEO_WARNINGS } from "./videoAnalysisTypes";
import type { BehaviorData, VideoAnalysis, VideoMetricKey } from "./videoAnalysisTypes";

export const VIDEO_FORMAT_ERROR = "결과 형식을 확인할 수 없습니다.";
const fail = (): never => { throw new Error(VIDEO_FORMAT_ERROR); };
const record = (value: unknown): Record<string, unknown> => {
  if (!value || typeof value !== "object" || Array.isArray(value)) return fail();
  return value as Record<string, unknown>;
};
const keys = (value: Record<string, unknown>, expected: readonly string[]) => {
  if (Object.keys(value).length !== expected.length || expected.some((key) => !(key in value))) fail();
};
const integer = (value: unknown, min: number, max: number): number =>
  typeof value === "number" && Number.isSafeInteger(value) && value >= min && value <= max ? value : fail();
const text = (value: unknown, max: number): string =>
  typeof value === "string" && Array.from(value).length > 0 && Array.from(value).length <= max ? value : fail();
const boolean = (value: unknown): boolean => typeof value === "boolean" ? value : fail();
const array = (value: unknown, min: number, max: number): unknown[] =>
  Array.isArray(value) && value.length >= min && value.length <= max ? value : fail();
const fraction = (value: unknown, expected: number) => {
  if (typeof value !== "number" || !Number.isFinite(value) || value < 0 || value > 1 || Math.abs(value - expected) > 0.000001) fail();
};
const pair = (value: unknown, max: number) => {
  const p = record(value);
  const denominatorMs = integer(p.denominatorMs, 0, max);
  const numeratorMs = integer(p.numeratorMs, 0, denominatorMs);
  return { numeratorMs, denominatorMs };
};
const missingReason = (key: VideoMetricKey, denominator: number, duration: number, faceTime: number) => {
  if (duration < 10_000) return "INSUFFICIENT_DURATION";
  if (key !== "faceVisibleRatio" && faceTime === 0) return "NO_SINGLE_FACE";
  if (denominator === 0) {
    if (key === "headFacingRatio") return "HEAD_POSE_UNAVAILABLE";
    if (key === "smileShapeRatio") return "BLENDSHAPES_UNAVAILABLE";
    if (key === "shoulderLevelRatio" || key === "upperBodyStableRatio") return "SHOULDERS_NOT_VISIBLE";
  }
  return "LOW_COVERAGE";
};

export const validateBehavior = (value: unknown): BehaviorData => {
  const d = record(value);
  keys(d, ["schemaVersion", "modelVersion", "thresholdsVersion", "videoId", "durationMs", "sampleIntervalMs", "sampledFrameCount", "sampledDurationMs", "metrics", "timeline", "events", "eventsTruncated", "summary", "warnings"]);
  if (d.schemaVersion !== "behavior-v1" || d.thresholdsVersion !== "behavior-policy-v1" || d.sampleIntervalMs !== 200) fail();
  text(d.modelVersion, 100); text(d.videoId, 200);
  const duration = integer(d.durationMs, 1, 3_600_000);
  const count = integer(d.sampledFrameCount, 0, Math.ceil(duration / 200));
  const sampled = integer(d.sampledDurationMs, 0, duration);
  if ((count === 0) !== (sampled === 0) || sampled > count * 200 || sampled < Math.max(0, (count - 1) * 200)) fail();
  const metrics = record(d.metrics);
  keys(metrics, VIDEO_METRICS);
  const faceTime = pair(metrics.faceVisibleRatio, sampled).numeratorMs;
  let availableCount = 0;
  for (const key of VIDEO_METRICS) {
    const m = record(metrics[key]);
    keys(m, ["status", "value", "numeratorMs", "denominatorMs", "coverageRatio", "unavailableReason"]);
    const { numeratorMs: n, denominatorMs: den } = pair(m, sampled);
    if (key !== "faceVisibleRatio" && den > faceTime) fail();
    fraction(m.coverageRatio, den / duration);
    const available = duration >= 10_000 && den >= 10_000 && den / duration >= 0.3;
    if (available) {
      if (m.status !== "AVAILABLE" || m.unavailableReason !== null) fail();
      fraction(m.value, n / den);
      availableCount++;
    } else if (m.status !== "UNAVAILABLE" || m.value !== null || m.unavailableReason !== missingReason(key, den, duration, faceTime)) fail();
  }
  if (!availableCount) fail();
  const width = Math.max(10_000, Math.ceil(duration / 60_000) * 1000);
  const bins = array(d.timeline, 1, 60);
  if (bins.length !== Math.ceil(duration / width)) fail();
  const sums = Object.fromEntries(VIDEO_METRICS.map((key) => [key, { numeratorMs: 0, denominatorMs: 0 }]));
  bins.forEach((value, index) => {
    const b = record(value);
    keys(b, ["startMs", "endMs", "metrics"]);
    if (b.startMs !== index * width || b.endMs !== Math.min((index + 1) * width, duration)) fail();
    const bm = record(b.metrics);
    keys(bm, VIDEO_METRICS);
    for (const key of VIDEO_METRICS) {
      keys(record(bm[key]), ["numeratorMs", "denominatorMs"]);
      const p = pair(bm[key], Number(b.endMs) - Number(b.startMs));
      sums[key].numeratorMs += p.numeratorMs; sums[key].denominatorMs += p.denominatorMs;
    }
  });
  for (const key of VIDEO_METRICS) {
    const m = record(metrics[key]);
    if (m.numeratorMs !== sums[key].numeratorMs || m.denominatorMs !== sums[key].denominatorMs) fail();
  }
  const events = array(d.events, 0, 60);
  const lastEnd: Record<string, number> = {};
  let previous: { start: number; type: string; end: number } | null = null;
  for (const value of events) {
    const e = record(value);
    keys(e, ["type", "sourceMetric", "startMs", "endMs"]);
    const type = text(e.type, 40);
    const source = VIDEO_EVENTS[type as keyof typeof VIDEO_EVENTS];
    const start = integer(e.startMs, 0, duration);
    const end = integer(e.endMs, start + 2000, duration);
    if (!source || e.sourceMetric !== source || record(metrics[source]).status !== "AVAILABLE" || start < (lastEnd[type] ?? 0)) fail();
    if (previous && (start < previous.start || (start === previous.start && (type < previous.type || (type === previous.type && end < previous.end))))) fail();
    previous = { start, type, end }; lastEnd[type] = end;
  }
  for (const value of bins) {
    const b = record(value);
    for (const [type, source] of Object.entries(VIDEO_EVENTS)) {
      const marked = events.reduce<number>((sum, value) => {
        const e = record(value);
        return sum + (e.type === type ? Math.max(0, Math.min(Number(e.endMs), Number(b.endMs)) - Math.max(Number(e.startMs), Number(b.startMs))) : 0);
      }, 0);
      const p = pair(record(b.metrics)[source], duration);
      if (marked > p.denominatorMs - p.numeratorMs) fail();
    }
  }
  array(d.summary, 0, 3).forEach((s) => text(s, 200));
  const warnings = array(d.warnings, 0, 8);
  if (new Set(warnings).size !== warnings.length || warnings.some((w, i) => !VIDEO_WARNINGS.includes(w as typeof VIDEO_WARNINGS[number]) || w !== [...warnings].sort()[i])) fail();
  const truncated = boolean(d.eventsTruncated);
  if (truncated && events.length !== 60) fail();
  const expectedWarnings = {
    EVENTS_TRUNCATED: truncated,
    LOW_SAMPLE_COVERAGE: sampled / duration < 0.9,
    LOW_FACE_COVERAGE: ["headFacingRatio", "smileShapeRatio"].some((key) => Number(record(metrics[key]).denominatorMs) / duration < 0.8),
    LOW_POSE_COVERAGE: ["shoulderLevelRatio", "upperBodyStableRatio"].some((key) => Number(record(metrics[key]).denominatorMs) / duration < 0.8),
  };
  for (const [code, expected] of Object.entries(expectedWarnings)) if (warnings.includes(code) !== expected) fail();
  return d as unknown as BehaviorData;
};

export const parseVideoAnalysis = (value: unknown): VideoAnalysis => {
  const wrapper = record(value);
  if (wrapper.success !== true) fail();
  const d = record(wrapper.data);
  if (!VIDEO_STATUSES.includes(d.status as VideoAnalysis["status"])) fail();
  const canRetry = boolean(d.canRetry);
  if (canRetry && d.status !== "PARTIAL" && d.status !== "FAILED") fail();
  // 구 API의 raw result는 행동 data로 해석하지 않는다.
  if (!("behavior" in d)) return { status: d.status as VideoAnalysis["status"], canRetry: false, reasonCode: "RESULT_SCHEMA_UNSUPPORTED", behavior: null, latestAnalysisId: null, behaviorAnalysisId: null, showingPreviousResult: false, errorMessage: null };
  const behavior = d.behavior === null ? null : validateBehavior(d.behavior);
  const latestAnalysisId = d.latestAnalysisId === null ? null : text(d.latestAnalysisId, 200);
  const behaviorAnalysisId = d.behaviorAnalysisId === null ? null : text(d.behaviorAnalysisId, 200);
  const showingPreviousResult = boolean(d.showingPreviousResult);
  const reasonCode = d.reasonCode === null ? null : text(d.reasonCode, 100);
  if ((behavior === null) !== (behaviorAnalysisId === null) || (behavior && latestAnalysisId === null) || showingPreviousResult !== (behavior !== null && latestAnalysisId !== behaviorAnalysisId)) fail();
  if ((d.status === "NONE" || d.status === "WAITING") && behavior) fail();
  if ((d.status === "READY" || d.status === "PARTIAL") && !behavior && reasonCode !== "RESULT_SCHEMA_UNSUPPORTED") fail();
  if (behavior && !showingPreviousResult && (d.status === "READY" || d.status === "PARTIAL")) {
    const ready = VIDEO_METRICS.every((key) => behavior.metrics[key].status === "AVAILABLE" && behavior.metrics[key].denominatorMs / behavior.durationMs >= 0.8) &&
      behavior.sampledDurationMs / behavior.durationMs >= 0.9 && !behavior.warnings.includes("COMPONENT_FAILURE");
    if ((d.status === "READY") !== ready) fail();
  }
  const errorMessage = d.status === "FAILED" && d.error != null
    ? text(record(d.error).message, 1000) : null;
  return { status: d.status as VideoAnalysis["status"], canRetry: canRetry && reasonCode !== "RESULT_SCHEMA_UNSUPPORTED", reasonCode, behavior, latestAnalysisId, behaviorAnalysisId, showingPreviousResult, errorMessage };
};
