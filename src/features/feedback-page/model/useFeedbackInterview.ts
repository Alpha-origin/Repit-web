import { useCallback, useEffect, useState } from "react";

import {
  getAllFeedbacks,
  getAllInterviews,
  getFeedback,
  type FeedbackData,
  type InterviewSummary,
} from "@/features/feedback-page/feedback-list/api/getAllInterviews";
import {
  getInterviewId,
  sortInterviewsByCreatedAt,
} from "@/features/feedback-page/model/interviewDisplay";
import { extractErrorMessage } from "@/shared/api/errorMessage";

export const useFeedbackInterview = (id?: string, includePreviousFeedback = false) => {
  const [interview, setInterview] = useState<InterviewSummary | null>(null);
  const [feedback, setFeedback] = useState<FeedbackData | null>(null);
  const [previousFeedback, setPreviousFeedback] = useState<FeedbackData | null>(null);
  const [feedbackErrorMessage, setFeedbackErrorMessage] = useState<string | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadInterview = useCallback(async () => {
    const interviewId = Number(id);
    setPreviousFeedback(null);

    if (!interviewId) {
      setInterview(null);
      setFeedback(null);
      setErrorMessage("면접 정보를 찾을 수 없습니다.");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    setFeedbackErrorMessage(null);

    const [interviewsResult, feedbackResult, historyResult] = await Promise.allSettled([
      getAllInterviews(),
      getFeedback(interviewId),
      includePreviousFeedback ? getAllFeedbacks() : Promise.resolve([]),
    ]);

    if (interviewsResult.status === "fulfilled") {
      const sortedInterviews = sortInterviewsByCreatedAt(interviewsResult.value);
      const nextInterview =
        sortedInterviews.find((item) => getInterviewId(item) === interviewId) ??
        null;

      setInterview(nextInterview);

      if (nextInterview?.createdAt && historyResult.status === "fulfilled") {
        const currentTime = new Date(nextInterview.createdAt).getTime();
        const completedFeedbacks = new Map(
          historyResult.value
            .filter((entry) =>
              (entry.status === "SUCCEEDED" || entry.status === "COMPLETED") &&
              typeof entry.totalScore === "number" && Number.isFinite(entry.totalScore),
            )
            .map((entry) => [entry.interviewId, entry]),
        );
        const priorInterview = sortedInterviews.find((item) =>
          item.createdAt && new Date(item.createdAt).getTime() < currentTime &&
          completedFeedbacks.has(getInterviewId(item)),
        );

        if (priorInterview) {
          setPreviousFeedback(completedFeedbacks.get(getInterviewId(priorInterview)) ?? null);
        }
      }

      if (!nextInterview) {
        setErrorMessage("면접 정보를 찾을 수 없습니다.");
      }
    } else {
      setInterview(null);
      setErrorMessage(
        extractErrorMessage(
          interviewsResult.reason,
          "면접 정보를 불러오지 못했습니다.",
        ),
      );
    }

    if (feedbackResult.status === "fulfilled") {
      setFeedback(feedbackResult.value);
    } else {
      setFeedback(null);
      setFeedbackErrorMessage(
        extractErrorMessage(
          feedbackResult.reason,
          "피드백을 불러오지 못했습니다.",
        ),
      );
    }

    setIsLoading(false);
  }, [id, includePreviousFeedback]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadInterview();
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [loadInterview]);

  return {
    errorMessage,
    feedback,
    feedbackErrorMessage,
    interview,
    previousFeedback,
    isLoading,
    refetch: loadInterview,
  };
};
