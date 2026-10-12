import { type ReactNode } from "react";

import type { PreparedInterviewData } from "@/features/interview-page/interview/api";
import type { InterviewStyleOption } from "@/shared/constants/interview-page/setting-interview";
import { InterviewSessionContext } from "./interviewSessionContextValue";
import {
  useInterviewSession,
  type InterviewTtsProvider,
} from "./useInterviewSession";

interface InterviewSessionProviderProps {
  children: ReactNode;
  interviewStyle?: InterviewStyleOption;
  preparedInterview?: PreparedInterviewData | null;
  ttsProvider?: InterviewTtsProvider;
}

export const InterviewSessionProvider = ({
  children,
  interviewStyle,
  preparedInterview,
  ttsProvider = "elevenlabs",
}: InterviewSessionProviderProps) => {
  const session = useInterviewSession(
    preparedInterview,
    ttsProvider,
    interviewStyle,
  );

  return (
    <InterviewSessionContext.Provider value={{ ...session, preparedInterview }}>
      {children}
    </InterviewSessionContext.Provider>
  );
};
