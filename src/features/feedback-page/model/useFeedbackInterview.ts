import { useCallback, useEffect, useState } from "react";

import {
  getAllInterviews,
  type InterviewSummary,
} from "@/features/feedback-page/feedback-list/api/getAllInterviews";
import { sortInterviewsByCreatedAt } from "@/features/feedback-page/model/interviewDisplay";
import { extractErrorMessage } from "@/shared/api/errorMessage";

export const useFeedbackInterview = (id?: string) => {
  const [interview, setInterview] = useState<InterviewSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadInterview = useCallback(async () => {
    const interviewId = Number(id);

    if (!interviewId) {
      setInterview(null);
      setErrorMessage("면접 정보를 찾을 수 없습니다.");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const interviews = await getAllInterviews();
      const sortedInterviews = sortInterviewsByCreatedAt(interviews);
      const nextInterview =
        sortedInterviews.find((item) => item.id === interviewId) ?? null;

      setInterview(nextInterview);

      if (!nextInterview) {
        setErrorMessage("면접 정보를 찾을 수 없습니다.");
      }
    } catch (error) {
      setInterview(null);
      setErrorMessage(extractErrorMessage(error, "면접 정보를 불러오지 못했습니다."));
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void loadInterview();
  }, [loadInterview]);

  return {
    errorMessage,
    interview,
    isLoading,
    refetch: loadInterview,
  };
};
