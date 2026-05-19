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
  items: readonly FeedbackListItem[];
  title: string;
}
