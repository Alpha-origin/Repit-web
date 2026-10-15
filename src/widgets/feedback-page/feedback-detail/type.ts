export interface FeedbackDetailQuestionItem {
  id: number;
  label: string;
  preview: string;
  personaLabel?: string;
  question: string;
  intention: string;
  myAnswer: string;
  modelAnswer: string;
  followUpQuestion: string;
  strengths: readonly string[];
  improvements: readonly string[];
  comment: string;
}

export interface FeedbackDetailTopSectionData {
  tabs: {
    overallLabel: string;
    detailLabel: string;
    activeTab: "overall" | "detail";
  };
  questionListTitle: string;
  questionTitle: string;
  intentionTitle: string;
  myAnswerTitle: string;
  showMyAnswerLabel: string;
  hideMyAnswerLabel: string;
  modelAnswerTitle: string;
  followUpTitle: string;
  questions: readonly FeedbackDetailQuestionItem[];
}

export interface FeedbackDetailMiddleSectionData {
  cards: readonly {
    title: string;
    tone: "positive" | "negative";
    paragraphs: readonly string[];
  }[];
}

export interface FeedbackDetailBottomSectionData {
  coachComment: string;
  secondaryActionLabel: string;
  primaryActionLabel: string;
}

export interface FeedbackDetailTopSectionProps {
  content: FeedbackDetailTopSectionData;
  question: FeedbackDetailQuestionItem;
}

export interface FeedbackDetailMiddleSectionProps {
  content: FeedbackDetailMiddleSectionData;
  question: FeedbackDetailQuestionItem;
}

export interface FeedbackDetailBottomSectionProps {
  content: FeedbackDetailBottomSectionData;
}

export interface FeedbackDetailProps {
  content: {
    topSection: FeedbackDetailTopSectionData;
    middleSection: FeedbackDetailMiddleSectionData;
    bottomSection: FeedbackDetailBottomSectionData;
  };
  isDownloadingPdf: boolean;
  onDownloadPdf: () => Promise<void> | void;
}
