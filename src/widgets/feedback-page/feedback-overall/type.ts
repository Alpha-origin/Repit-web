export type FeedbackOverallBarItem = {
  label: string;
  score: number;
  tone: "primary" | "muted";
};

export type FeedbackOverallComparisonCard = {
  title: string;
  highlightText?: string;
  bars: readonly FeedbackOverallBarItem[];
};

export type FeedbackOverallKeywordItem = {
  text: string;
  size: "xs" | "sm" | "md" | "xl";
  top: string;
  left: string;
};

export type FeedbackOverallTopSectionData = {
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
};

export type FeedbackOverallMiddleSectionData = {
  cards: readonly {
    title: string;
    content: string;
  }[];
};

export type FeedbackOverallBottomSectionData = {
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
};

type SectionProps<T> = {
  content: T;
};

export type FeedbackOverallTopSectionProps =
  SectionProps<FeedbackOverallTopSectionData>;

export type FeedbackOverallMiddleSectionProps =
  SectionProps<FeedbackOverallMiddleSectionData>;

export type FeedbackOverallBottomSectionProps =
  SectionProps<FeedbackOverallBottomSectionData>;
