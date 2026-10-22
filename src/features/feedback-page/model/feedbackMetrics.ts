import type { FeedbackData, ScoreBreakdown, Verdict } from "../feedback-list/api/getAllInterviews";
import type { FeedbackOverallMetric } from "@/widgets/feedback-page/feedback-overall/type";

export const COMPETENCY_VERSION = "competency-v1";

const LEGACY_AXES = [
  ["INTENT", "의도 충족"], ["DEPTH", "깊이"],
  ["SPECIFICITY", "구체성"], ["ACCURACY", "정확성"],
] as const;

const COMPETENCY_AXES = [
  ["PROBLEM_SOLVING", "문제 해결·판단"], ["KNOWLEDGE", "직무 지식"],
  ["OWNERSHIP", "실행·기여"], ["COLLABORATION", "협업·소통"], ["GROWTH", "성장·성찰"],
] as const;

export const VERDICT_LABEL: Record<Verdict, string> = {
  STRONG: "강함",
  SOLID: "충분",
  BORDERLINE: "보완 필요",
  WEAK: "부족",
};

const isVerdict = (value: unknown): value is Verdict =>
  typeof value === "string" && value in VERDICT_LABEL;

const validScore = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value) && value >= 0 && value <= 100;

const isCompetencyBreakdown = (breakdown?: ScoreBreakdown | null) =>
  breakdown?.scoringVersion === COMPETENCY_VERSION;

const buildLegacyMetrics = (feedback: FeedbackData): FeedbackOverallMetric[] => {
  const axes = Array.isArray(feedback.scoreBreakdown?.axes) ? feedback.scoreBreakdown.axes : [];
  return LEGACY_AXES.map(([axis, label]) => {
    const entries = axes.filter((entry) => entry?.axis === axis);
    if (entries.length === 1) {
      const entry = entries[0];
      if (validScore(entry.score)) return { label, score: entry.score };
      if (entry.score === null && entry.weight === null) {
        return { label, score: null, emptyLabel: "해당 없음" };
      }
    }
    if (entries.length === 0 && axis === "INTENT" && validScore(feedback.intentAlignmentScore)) {
      return { label, score: feedback.intentAlignmentScore };
    }
    return { label, score: null, emptyLabel: "미제공" };
  });
};

const buildCompetencyMetrics = (breakdown: ScoreBreakdown): FeedbackOverallMetric[] => {
  const axes = Array.isArray(breakdown.axes) ? breakdown.axes : [];
  return COMPETENCY_AXES.map(([axis, label]) => {
    const entries = axes.filter((entry) => entry?.axis === axis);
    if (entries.length !== 1) return { label, score: null, emptyLabel: "미제공" };

    const entry = entries[0];
    if (entry.score === null) {
      return entry.weight === null && (entry.verdict === null || entry.verdict === undefined) &&
        Number.isInteger(entry.evidenceCount) && entry.evidenceCount === 0
        ? { label, score: null, emptyLabel: "이번 면접에서 확인되지 않음" }
        : { label, score: null, emptyLabel: "미제공" };
    }
    if (
      !validScore(entry.score) ||
      typeof entry.weight !== "number" || !Number.isInteger(entry.weight) || entry.weight < 0 || entry.weight > 100 ||
      !isVerdict(entry.verdict) ||
      !Number.isInteger(entry.evidenceCount) ||
      entry.evidenceCount < 1
    ) {
      return { label, score: null, emptyLabel: "미제공" };
    }

    return {
      label,
      score: entry.score,
      verdictLabel: VERDICT_LABEL[entry.verdict],
      note: entry.evidenceCount === 1 ? "근거 부족 (1문항)" : undefined,
    };
  });
};

export const buildFeedbackMetrics = (feedback: FeedbackData): FeedbackOverallMetric[] =>
  isCompetencyBreakdown(feedback.scoreBreakdown)
    ? buildCompetencyMetrics(feedback.scoreBreakdown)
    : buildLegacyMetrics(feedback);
