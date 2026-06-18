export interface FeedbackListItem {
  id: number;
  date: string;
  title: string;
  styleLabel: string;
  levelLabel: string;
  interviewerName: string;
  statusLabel: string;
}

export interface FeedbackListProps {
  emptyMessage?: string;
  errorMessage?: string | null;
  isLoading?: boolean;
  items: readonly FeedbackListItem[];
  onRetry?: () => void;
  title: string;
}
