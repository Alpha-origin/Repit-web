export interface FeedbackOverallBarItem {
  label: string;
  score: number;
  tone: "primary" | "muted";
}

export interface FeedbackOverallComparisonCard {
  title: string;
  highlightText?: string;
  bars: readonly FeedbackOverallBarItem[];
}

export interface FeedbackOverallKeywordItem {
  text: string;
  size: "xs" | "sm" | "md" | "xl";
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
    score: number;
    description: readonly string[];
  };
  averageComparison: {
    title: string;
    bars: readonly FeedbackOverallBarItem[];
  };
  comparisonCards: readonly FeedbackOverallComparisonCard[];
}

export interface FeedbackOverallMiddleSectionData {
  cards: readonly {
    title: string;
    content: string;
  }[];
}

export interface FeedbackOverallBottomSectionData {
  reliability: {
    title: string;
    scoreLabel: string;
    levelLabel: string;
  };
  questionFit: {
    title: string;
    content: string;
  };
  keywords: {
    items: readonly FeedbackOverallKeywordItem[];
  };
}

export interface FeedbackOverallTopSectionProps {
  content: FeedbackOverallTopSectionData;
}

export interface FeedbackOverallMiddleSectionProps {
  content: FeedbackOverallMiddleSectionData;
}

export interface FeedbackOverallBottomSectionProps {
  content: FeedbackOverallBottomSectionData;
}
