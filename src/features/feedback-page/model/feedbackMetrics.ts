import type { FeedbackData } from "../feedback-list/api/getAllInterviews";
import type { FeedbackOverallMetric } from "@/widgets/feedback-page/feedback-overall/type";

const AXES = [
  ["INTENT", "의도 충족"], ["DEPTH", "깊이"],
  ["SPECIFICITY", "구체성"], ["ACCURACY", "정확성"],
] as const;

const validScore = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value) && value >= 0 && value <= 100;

export const buildFeedbackMetrics = (feedback: FeedbackData): FeedbackOverallMetric[] => {
  const axes = Array.isArray(feedback.scoreBreakdown?.axes) ? feedback.scoreBreakdown.axes : [];
  return AXES.map(([axis, label]) => {
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
