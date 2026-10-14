import { useCallback, useEffect, useRef, useState } from "react";

import {
  getInterviewAnswers,
  type InterviewAnswer,
} from "@/features/feedback-page/api/getInterviewAnswers";

import {
  getAllFeedbacks,
  getAllInterviews,
  getFeedback,
  getOrRequestFeedback,
  type FeedbackData,
  type InterviewSummary,
} from "@/features/feedback-page/feedback-list/api/getAllInterviews";
import {
  getInterviewId,
  sortInterviewsByCreatedAt,
} from "@/features/feedback-page/model/interviewDisplay";
import { extractErrorMessage } from "@/shared/api/errorMessage";

export const useFeedbackInterview = (id?: string, includePreviousFeedback = false) => {
  const [answers, setAnswers] = useState<InterviewAnswer[]>([]);
  const [answersErrorMessage, setAnswersErrorMessage] = useState<string | null>(null);
  const [interview, setInterview] = useState<InterviewSummary | null>(null);
  const [feedback, setFeedback] = useState<FeedbackData | null>(null);
  const [previousFeedback, setPreviousFeedback] = useState<FeedbackData | null>(null);
  const [feedbackErrorMessage, setFeedbackErrorMessage] = useState<string | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const requestIdRef = useRef(0);

  const loadInterview = useCallback(async () => {
    const requestId = ++requestIdRef.current;
    const interviewId = Number(id);
    setAnswers([]);
    setAnswersErrorMessage(null);
    setFeedback(null);
    setPreviousFeedback(null);

    if (!Number.isSafeInteger(interviewId) || interviewId <= 0) {
      setInterview(null);
      setFeedback(null);
      setErrorMessage("면접 정보를 찾을 수 없습니다.");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    setFeedbackErrorMessage(null);

    const [interviewsResult, historyResult, answersResult] = await Promise.allSettled([
      getAllInterviews(),
      includePreviousFeedback ? getAllFeedbacks() : Promise.resolve([]),
      getInterviewAnswers(interviewId),
    ]);

    if (requestId !== requestIdRef.current) {
      return;
    }

    if (answersResult.status === "fulfilled") {
      setAnswers(answersResult.value);
    } else {
      setAnswersErrorMessage(
        extractErrorMessage(answersResult.reason, "면접 답변을 불러오지 못했습니다."),
      );
    }

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
      } else if (nextInterview.status !== "COMPLETED") {
        setFeedbackErrorMessage("아직 완료되지 않은 면접입니다. 면접을 마친 뒤 피드백을 확인해주세요.");
      } else {
        try {
          const nextFeedback = await getOrRequestFeedback(interviewId);

          if (requestId !== requestIdRef.current) {
            return;
          }

          setFeedback(nextFeedback);
        } catch (error) {
          if (requestId !== requestIdRef.current) {
            return;
          }

          setFeedbackErrorMessage(
            extractErrorMessage(error, "피드백을 불러오지 못했습니다."),
          );
        }
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

    setIsLoading(false);
  }, [id, includePreviousFeedback]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadInterview();
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
      requestIdRef.current += 1;
    };
  }, [loadInterview]);

  const feedbackStatus = feedback?.status;

  useEffect(() => {
    const interviewId = Number(id);
    const isPending = feedbackStatus === "PENDING" || feedbackStatus === "IN_PROGRESS";

    if (isLoading || !isPending || !Number.isSafeInteger(interviewId) || interviewId <= 0) {
      return;
    }

    const controller = new AbortController();
    const deadline = Date.now() + 5 * 60_000;
    let timeoutId: number;

    const pollFeedback = async () => {
      try {
        const nextFeedback = await getFeedback(interviewId, controller.signal);

        if (controller.signal.aborted) {
          return;
        }

        if (nextFeedback) {
          setFeedback(nextFeedback);
          setFeedbackErrorMessage(null);

          if (nextFeedback.status !== "PENDING" && nextFeedback.status !== "IN_PROGRESS") {
            return;
          }
        }

        if (Date.now() >= deadline) {
          setFeedbackErrorMessage("피드백 분석이 지연되고 있습니다. 잠시 후 다시 확인해주세요.");
          return;
        }

        timeoutId = window.setTimeout(() => void pollFeedback(), 5_000);
      } catch (error) {
        if (!controller.signal.aborted) {
          setFeedbackErrorMessage(
            extractErrorMessage(error, "피드백 분석 상태를 확인하지 못했습니다."),
          );
        }
      }
    };

    timeoutId = window.setTimeout(() => void pollFeedback(), 5_000);

    return () => {
      controller.abort();
      window.clearTimeout(timeoutId);
    };
  }, [id, isLoading, feedbackStatus]);

  return {
    answers,
    answersErrorMessage,
    errorMessage,
    feedback,
    feedbackErrorMessage,
    interview,
    previousFeedback,
    isLoading,
    refetch: loadInterview,
  };
};
