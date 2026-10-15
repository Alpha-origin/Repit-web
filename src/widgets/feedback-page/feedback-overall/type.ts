export interface FeedbackOverallMetric {
  label: string;
  score: number | null;
  description?: string;
}

export interface FeedbackOverallPersonaFeedback {
  title: string;
  comment: string;
  imageUrl?: string;
  score: number | null;
  hasNoAnswer: boolean;
}

export interface FeedbackOverallKeywordItem {
  text: string;
  size: "xs" | "sm" | "md" | "lg" | "xl";
  top: string;
  left: string;
}

export interface FeedbackOverallTopSectionData {
  tabs: {
    overallLabel: string;
    detailLabel: string;
    activeTab: "overall" | "detail";
  };
  summary: {
    title: string;
    score: number | null;
    description: readonly string[];
  };
  metrics: readonly FeedbackOverallMetric[];
  evaluation: string;
}

export interface FeedbackOverallMiddleSectionData {
  cards: readonly {
    title: string;
    tone: "positive" | "negative";
    items: readonly string[];
  }[];
  comparison: {
    previousScore: number | null;
    currentScore: number | null;
  };
  personaFeedbacks: readonly FeedbackOverallPersonaFeedback[];
}

export interface FeedbackOverallBottomSectionData {
  speechMetrics: readonly FeedbackOverallMetric[];
  reliability: {
    title: string;
    scoreLabel: string;
    levelLabel: string;
  };
  keywords: {
    items: readonly FeedbackOverallKeywordItem[];
  };
  pdfActionLabel: string;
}

export interface FeedbackOverallTopSectionProps {
  content: FeedbackOverallTopSectionData;
}

export interface FeedbackOverallMiddleSectionProps {
  content: FeedbackOverallMiddleSectionData;
}

export interface FeedbackOverallBottomSectionProps {
  content: FeedbackOverallBottomSectionData;
  isDownloadingPdf?: boolean;
  onDownloadPdf?: () => void;
}
