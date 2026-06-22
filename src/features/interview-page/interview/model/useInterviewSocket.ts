import { useEffect } from "react";

import {
  connectInterviewSocket,
  disconnectInterviewSocket,
  getCurrentInterviewQuestion,
  parseInterviewSocketMessage,
  type CurrentInterviewQuestion,
  type InterviewProgressStatus,
} from "@/features/interview-page/interview/api";

interface UseInterviewSocketParams {
  sessionId?: string | null;
  onQuestionReceived?: (question: CurrentInterviewQuestion) => void;
  onStatusChange?: (params: {
    message: string | null;
    question: CurrentInterviewQuestion | null;
    status: InterviewProgressStatus | null;
  }) => void;
}

export const useInterviewSocket = ({
  sessionId,
  onQuestionReceived,
  onStatusChange,
}: UseInterviewSocketParams) => {
  useEffect(() => {
    if (!sessionId) {
      return;
    }

    let isMounted = true;
    let hasReceivedSocketQuestion = false;
    const socket = connectInterviewSocket(sessionId);

    if (!socket) {
      return;
    }

    const syncCurrentQuestion = async () => {
      const { data } = await getCurrentInterviewQuestion(sessionId);

      if (!isMounted || !data || hasReceivedSocketQuestion) {
        return;
      }

      onQuestionReceived?.(data);
    };

    const handleMessage = (event: MessageEvent) => {
      const nextEvent = parseInterviewSocketMessage(event.data);

      if (nextEvent.question) {
        hasReceivedSocketQuestion = true;
        onQuestionReceived?.(nextEvent.question);
      }

      if (nextEvent.status || nextEvent.message) {
        onStatusChange?.(nextEvent);
      }
    };

    socket.addEventListener("message", handleMessage);
    void syncCurrentQuestion();

    return () => {
      isMounted = false;
      socket.removeEventListener("message", handleMessage);
      disconnectInterviewSocket(sessionId);
    };
  }, [onQuestionReceived, onStatusChange, sessionId]);
};
