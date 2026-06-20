import { useCallback, useEffect, useState } from "react";

import { getAllInterviews } from "@/features/feedback-page/feedback-list/api/getAllInterviews";
import {
  getCareerLabel,
  getFormattedDate,
  getInterviewStatusLabel,
  getInterviewStyleLabel,
  getInterviewTitle,
  getInterviewerName,
  sortInterviewsByCreatedAt,
} from "@/features/feedback-page/model/interviewDisplay";
import type { FeedbackListItem } from "@/widgets/feedback-page/feedback-list/type";

const getListItems = (items: Awaited<ReturnType<typeof getAllInterviews>>) =>
  sortInterviewsByCreatedAt(items).map<FeedbackListItem>((interview) => ({
    id: interview.id,
    date: getFormattedDate(interview.createdAt),
    title: getInterviewTitle(interview.persona?.major),
    styleLabel: getInterviewStyleLabel(interview.persona?.type),
    levelLabel: getCareerLabel(interview.persona?.career),
    interviewerName: getInterviewerName(interview),
    statusLabel: getInterviewStatusLabel(interview.status),
  }));

export const useFeedbackList = () => {
  const [items, setItems] = useState<FeedbackListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadFeedbackList = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const interviews = await getAllInterviews();

      setItems(getListItems(interviews));
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "면접 목록을 불러오지 못했습니다.",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadFeedbackList();
  }, [loadFeedbackList]);

  return {
    errorMessage,
    isLoading,
    items,
    refetch: loadFeedbackList,
  };
};
