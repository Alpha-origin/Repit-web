import { readCompanyBadge } from "@/features/interview-page/company/model/type";
import { useCallback, useEffect, useState } from "react";

import {
  getAllFeedbacks,
  getAllInterviews,
  type FeedbackData,
} from "@/features/feedback-page/feedback-list/api/getAllInterviews";
import {
  getFormattedDate,
  getInterviewStatusLabel,
  getInterviewStyleLabel,
  getInterviewModeLabel,
  getInterviewId,
  getInterviewerName,
  getLevelLabel,
  sortInterviewsByCreatedAt,
} from "@/features/feedback-page/model/interviewDisplay";
import { extractErrorMessage } from "@/shared/api/errorMessage";
import InterviewerImage1 from "@/shared/img/interview-page/interviewer1.svg?url";
import InterviewerImage2 from "@/shared/img/interview-page/interviewer2.svg?url";
import InterviewerImage3 from "@/shared/img/interview-page/interviewer3.svg?url";
import InterviewerImage4 from "@/shared/img/interview-page/interviewer4.svg?url";
import type { FeedbackListItem } from "@/widgets/feedback-page/feedback-list/type";

const INTERVIEWER_IMAGES = [
  InterviewerImage1,
  InterviewerImage2,
  InterviewerImage3,
  InterviewerImage4,
] as const;

const getInterviewerImageUrl = (
  interviewId: number,
  interviewerName: string,
  personaId?: number,
) => {
  const matchedNumber = interviewerName.match(/\d+/)?.[0];
  const imageIndex = Number(matchedNumber ?? personaId);

  if (Number.isInteger(imageIndex) && imageIndex >= 1) {
    return INTERVIEWER_IMAGES[(imageIndex - 1) % INTERVIEWER_IMAGES.length];
  }

  return INTERVIEWER_IMAGES[(interviewId - 1) % INTERVIEWER_IMAGES.length];
};

const getListItems = (
  items: Awaited<ReturnType<typeof getAllInterviews>>,
  feedbackByInterviewId: Map<number, FeedbackData>,
  feedbackBySessionId: Map<string, FeedbackData>,
): FeedbackListItem[] =>
  sortInterviewsByCreatedAt(items).map<FeedbackListItem>((interview) => {
    const interviewerName = getInterviewerName(interview);
    const interviewId = getInterviewId(interview);
    const feedback =
      feedbackByInterviewId.get(interviewId) ??
      (interview.sessionId
        ? feedbackBySessionId.get(interview.sessionId)
        : undefined);
    const feedbackInterviewId = feedback?.interviewId;
    const targetInterviewId =
      typeof feedbackInterviewId === "number" &&
      Number.isInteger(feedbackInterviewId) &&
      feedbackInterviewId > 0
        ? feedbackInterviewId
        : interviewId;

    return {
      id: targetInterviewId,
      companyName: readCompanyBadge(interview.company)?.displayName,
      date: getFormattedDate(interview.createdAt),
      imageUrl:
        interview.persona?.imageUrl ??
        getInterviewerImageUrl(
          targetInterviewId,
          interviewerName,
          interview.persona?.id,
        ),
      title: getInterviewModeLabel(interview),
      styleLabel: getInterviewStyleLabel(
        feedback?.style ?? interview.persona?.type,
      ),
      levelLabel: getLevelLabel(feedback?.level ?? interview.persona?.level),
      interviewerName,
      statusLabel: feedback
        ? getInterviewStatusLabel(feedback.status)
        : interview.status === "COMPLETED"
          ? "분석 대기"
          : getInterviewStatusLabel(interview.status),
      sessionId: interview.sessionId,
      totalScore: feedback?.totalScore,
      summary: feedback?.summary,
      answeredCount: feedback?.answeredCount,
      questionCount: feedback?.questionCount,
    };
  });

export const useFeedbackList = () => {
  const [items, setItems] = useState<FeedbackListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadFeedbackList = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const [interviews, feedbacks] = await Promise.all([
        getAllInterviews(),
        getAllFeedbacks(),
      ]);
      const feedbackByInterviewId = new Map<number, FeedbackData>();
      const feedbackBySessionId = new Map<string, FeedbackData>();

      feedbacks.forEach((feedback) => {
        const interviewId = feedback.interviewId;

        if (
          typeof interviewId === "number" &&
          Number.isInteger(interviewId) &&
          interviewId > 0
        ) {
          feedbackByInterviewId.set(interviewId, feedback);
        }

        if (feedback.sessionId) {
          feedbackBySessionId.set(feedback.sessionId, feedback);
        }
      });

      if (interviews.length === 0) {
        setItems([]);
        return;
      }

      setItems(
        getListItems(interviews, feedbackByInterviewId, feedbackBySessionId),
      );
    } catch (error) {
      setItems([]);
      setErrorMessage(
        extractErrorMessage(error, "지난 면접 목록을 불러오지 못했습니다."),
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
