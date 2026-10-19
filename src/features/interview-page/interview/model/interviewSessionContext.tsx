import { type ReactNode } from "react";

import type { PreparedInterviewData } from "@/features/interview-page/interview/api";
import { InterviewSessionContext } from "./interviewSessionContextValue";
import { useInterviewSession } from "./useInterviewSession";

interface InterviewSessionProviderProps {
  children: ReactNode;
  preparedInterview?: PreparedInterviewData | null;
}

export const InterviewSessionProvider = ({
  children,
  preparedInterview,
}: InterviewSessionProviderProps) => {
  const session = useInterviewSession(preparedInterview);

  return (
    <InterviewSessionContext.Provider value={{ ...session, preparedInterview }}>
      {children}
    </InterviewSessionContext.Provider>
  );
};
