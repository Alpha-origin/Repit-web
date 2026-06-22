import { getRecord, getTrimmedString } from "../shared";

const ACTIVE_INTERVIEW_SESSION_STORAGE_KEY = "activeInterviewSessionId";

export const setActiveInterviewSessionId = (sessionId: string) => {
  if (typeof window === "undefined") {
    return;
  }

  const trimmedSessionId = sessionId.trim();

  if (!trimmedSessionId) {
    return;
  }

  window.sessionStorage.setItem(
    ACTIVE_INTERVIEW_SESSION_STORAGE_KEY,
    trimmedSessionId,
  );
};

export const clearActiveInterviewSessionId = () => {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.removeItem(ACTIVE_INTERVIEW_SESSION_STORAGE_KEY);
};

export const getActiveInterviewSessionId = (state?: unknown) => {
  const stateRecord = getRecord(state);
  const preparedInterviewRecord = getRecord(stateRecord?.preparedInterview);
  const stateSessionId = getTrimmedString(preparedInterviewRecord?.sessionId);

  if (stateSessionId) {
    return stateSessionId;
  }

  if (typeof window === "undefined") {
    return null;
  }

  return getTrimmedString(
    window.sessionStorage.getItem(ACTIVE_INTERVIEW_SESSION_STORAGE_KEY),
  );
};
