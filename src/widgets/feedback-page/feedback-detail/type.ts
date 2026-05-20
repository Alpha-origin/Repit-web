export interface FeedbackDetailQuestionItem {
  id: number;
  label: string;
  preview: string;
  question: string;
  intention: string;
  myAnswer: string;
  modelAnswer: string;
  followUpQuestion: string;
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
}

export interface FeedbackDetailMiddleSectionProps {
  content: FeedbackDetailMiddleSectionData;
}

export interface FeedbackDetailBottomSectionProps {
  content: FeedbackDetailBottomSectionData;
}
