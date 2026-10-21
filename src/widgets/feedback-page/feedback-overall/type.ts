import type { ReactNode } from "react";

export interface FeedbackOverallMetric {
  label: string;
  score: number | null;
  description?: string;
  emptyLabel?: "해당 없음" | "미제공" | "이번 면접에서 확인되지 않음";
  verdictLabel?: string;
  note?: string;
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
    responseLabel?: string;
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
    note?: string;
  };
  motivation?: {
    score: number;
    verdictLabel?: string;
    note: string;
  };
  showPersonaFeedback: boolean;
  personaFeedbacks: readonly FeedbackOverallPersonaFeedback[];
}

export interface FeedbackOverallBottomSectionData {
  reliability: {
    title: string;
    scoreLabel: string;
    levelLabel: string;
    issues?: readonly { title: string; questionLabels: readonly [string, string]; quotes: readonly [string, string] }[];
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

export interface FeedbackSpeechAnalysis {
  visible: boolean;
  message: string;
  canRetry: boolean;
}

export interface FeedbackOverallBottomSectionProps {
  videoAnalysis?: ReactNode;
  speechAnalysis: FeedbackSpeechAnalysis;
  onRetrySpeechAnalysis: () => void;
  content: FeedbackOverallBottomSectionData;
  isDownloadingPdf?: boolean;
  onDownloadPdf?: () => void;
}
