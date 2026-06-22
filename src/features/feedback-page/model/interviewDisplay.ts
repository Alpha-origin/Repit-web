import type { InterviewSummary } from "@/features/feedback-page/feedback-list/api/getAllInterviews";

const MAJOR_LABELS: Record<string, string> = {
  BACKEND: "백엔드",
  FRONTEND: "프론트엔드",
  FULLSTACK: "풀스택",
  MOBILE: "모바일",
  DEVOPS: "데브옵스",
  DATA: "데이터",
  AI: "AI",
};

const STYLE_LABELS: Record<string, string> = {
  FRIENDLY: "편함",
  NORMAL: "일반",
  NEUTRAL: "일반",
  PRESSURE: "압박",
  STRESS: "압박",
  HARD: "압박",
};

const STATUS_LABELS: Record<string, string> = {
  COMPLETED: "분석완료",
  FINISHED: "분석완료",
  DONE: "분석완료",
  IN_PROGRESS: "진행중",
  READY: "대기중",
};

const getSafeDate = (value?: string) => {
  if (!value) {
    return null;
  }

  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? null : date;
};

export const getFormattedDate = (value?: string) => {
  const date = getSafeDate(value);

  if (!date) {
    return "-";
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}/${month}/${day}`;
};

export const sortInterviewsByCreatedAt = (items: InterviewSummary[]) =>
  [...items].sort((left, right) => {
    const leftTime = getSafeDate(left.createdAt)?.getTime() ?? 0;
    const rightTime = getSafeDate(right.createdAt)?.getTime() ?? 0;

    return rightTime - leftTime;
  });

export const getInterviewMajorLabel = (major?: string) => {
  if (!major) {
    return "일반";
  }

  return MAJOR_LABELS[major] ?? major;
};

export const getInterviewTitle = (major?: string) =>
  `${getInterviewMajorLabel(major)} 모의면접`;

export const getInterviewStyleLabel = (type?: string) => {
  if (!type) {
    return "일반";
  }

  return STYLE_LABELS[type] ?? type;
};

export const getCareerLabel = (career?: number) => {
  if (career === undefined || career === null) {
    return "미정";
  }

  if (career <= 1) {
    return "쉬움";
  }

  if (career <= 3) {
    return "보통";
  }

  return "어려움";
};

export const getInterviewerName = (interview: InterviewSummary) =>
  interview.persona?.personaName?.trim() || "면접관";

export const getInterviewStatusLabel = (status?: string) => {
  if (!status) {
    return "분석완료";
  }

  return STATUS_LABELS[status] ?? status;
};
