type CloseInterview = () => Promise<boolean>;
let closeInterview: CloseInterview | null = null;

export const registerInterviewLifecycle = (close: CloseInterview) => {
  closeInterview = close;
  return () => {
    if (closeInterview === close) closeInterview = null;
  };
};

export const finishActiveInterview = async () => closeInterview ? closeInterview() : true;
