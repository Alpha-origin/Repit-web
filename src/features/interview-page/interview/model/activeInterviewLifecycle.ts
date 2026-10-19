type CloseInterview = () => Promise<boolean>;
let closeInterview: CloseInterview | null = null;
let pendingInterviewLeave: (() => Promise<void>) | null = null;

export const setPendingInterviewLeave = (leave: () => Promise<void>) => { pendingInterviewLeave = leave; };
export const clearPendingInterviewLeave = () => { pendingInterviewLeave = null; };
export const resumePendingInterviewLeave = async () => {
  const leave = pendingInterviewLeave;
  pendingInterviewLeave = null;
  if (!leave) return false;
  await leave();
  return true;
};

export const registerInterviewLifecycle = (close: CloseInterview) => {
  closeInterview = close;
  return () => {
    if (closeInterview === close) {
      closeInterview = null;
      clearPendingInterviewLeave();
    }
  };
};

export const finishActiveInterview = async () => closeInterview ? closeInterview() : true;
