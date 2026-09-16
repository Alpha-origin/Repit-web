import type { InterviewSummary } from "@/features/feedback-page/feedback-list/api/getAllInterviews";

export const getInterviewId = (interview: InterviewSummary) =>
  interview.interviewId ?? interview.id ?? 0;

const MAJOR_LABELS: Record<string, string> = {
  BACKEND: "백엔드",
  FRONTEND: "프론트엔드",
  FULLSTACK: "풀스택",
  MOBILE: "모바일",
  DEVOPS: "데브옵스",
  DATA: "데이터",
  AI: "AI",
};

const PERSONA_TYPE_LABELS: Record<string, string> = {
  FRIENDLY: "친근한",
  REALISTIC: "현실적인",
  METICULOUS: "꼼꼼한",
};

const STATUS_LABELS: Record<string, string> = {
  SUCCEEDED: "분석완료",
  COMPLETED: "분석완료",
  FINISHED: "분석완료",
  DONE: "분석완료",
  IN_PROGRESS: "진행중",
  READY: "대기중",
  PENDING: "분석중",
  FAILED: "분석실패",
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
    return "미제공";
  }

  return MAJOR_LABELS[major] ?? major;
};

export const getInterviewTitle = (major?: string) =>
  `${getInterviewMajorLabel(major)} 모의면접`;

export const getInterviewModeLabel = (interview: InterviewSummary) => {
  if (interview.mode !== "MULTI") return "일대일 모의면접";
  const count = getInterviewerCount(interview);
  return count > 1 ? `${count}:1 모의면접` : "다대일 모의면접";
};

export const getInterviewerCount = (interview: InterviewSummary) => {
  if (interview.personaIds && interview.personaIds.length > 0) {
    return interview.personaIds.length;
  }

  return interview.personaId || interview.persona?.id ? 1 : 0;
};

export const getInterviewStyleLabel = (type?: string) => {
  if (!type) {
    return "미제공";
  }

  return PERSONA_TYPE_LABELS[type] ?? "성향 미정";
};

export const getCareerLabel = (career?: number) => {
  if (career === undefined || career === null) {
    return "미제공";
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
  interview.persona?.personaName?.trim() ||
  (getInterviewerCount(interview) > 0
    ? `면접관 ${getInterviewerCount(interview)}명`
    : "면접관 정보 없음");

export const getInterviewStatusLabel = (status?: string) => {
  if (!status) {
    return "상태 확인 중";
  }

  return STATUS_LABELS[status] ?? status;
};
