export interface FeedbackListItem {
  companyName?: string;
  id: number;
  date: string;
  createdAt?: string;
  imageUrl: string;
  title: string;
  styleLabel: string;
  levelLabel: string;
  interviewerName: string;
  statusLabel: string;
  sessionId?: string;
  totalScore?: number;
  summary?: string;
  answeredCount?: number;
  questionCount?: number;
}

export interface FeedbackListProps {
  emptyMessage?: string;
  errorMessage?: string | null;
  isLoading?: boolean;
  items: readonly FeedbackListItem[];
  onRetry?: () => void;
  title: string;
}
