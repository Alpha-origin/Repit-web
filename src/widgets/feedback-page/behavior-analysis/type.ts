import type { FeedbackVideoView } from "@/features/feedback-page/model/useFeedbackVideoAnalysis";

export interface BehaviorAnalysisProps {
  view: FeedbackVideoView;
  onRefresh: () => void;
  onRetry: () => void;
}
