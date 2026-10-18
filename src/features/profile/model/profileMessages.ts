import { getDocumentTypeLabel } from "@/shared/constants/job/documentTypes";
import { getJobRole, type JobRole } from "@/shared/constants/job/jobRoles";
import type { LatestProfile, ProfileFailureReason } from "../api";

export const PROFILE_FAILURE_MESSAGES: Record<ProfileFailureReason, string> = {
  REPO_NOT_PUBLIC: "GitHub 저장소가 비공개라 읽을 수 없어요. public으로 바꾼 뒤 다시 저장해 주세요",
  INVALID_MATERIAL: "PDF를 열 수 없거나 자료 형식이 올바르지 않아요",
  UNREADABLE_DOCUMENT: "필수 문서의 내용을 읽지 못했어요. 원본 파일에서 PDF로 다시 내보내 올려 주세요",
  INSUFFICIENT_EVIDENCE: "코드에서 질문 근거를 충분히 찾지 못했어요. 핵심 기능이 담긴 저장소를 추가하거나 포트폴리오를 보강해 주세요",
  INTERNAL: "분석 중 문제가 생겼어요",
};

const getNonDevInsufficientMessage = (job: JobRole) => {
  const documents = [...job.requiredDocuments, ...job.optionalDocuments]
    .map(getDocumentTypeLabel).join(", ");
  return `자료에서 질문 근거를 충분히 찾지 못했어요. ${documents}처럼 직접 한 일이 드러나는 문서를 더 올려 주세요`;
};

export const getProfileFailureMessage = (profile: LatestProfile, jobRole?: string | null) => {
  const job = getJobRole(jobRole);
  if (profile.failureReason === "INSUFFICIENT_EVIDENCE" && job?.category === "NON_DEVELOPMENT") {
    return getNonDevInsufficientMessage(job);
  }
  return (profile.failureReason && PROFILE_FAILURE_MESSAGES[profile.failureReason]) ||
    profile.errorMessage || PROFILE_FAILURE_MESSAGES.INTERNAL;
};

export const formatProfileCompletedAt = (value: string | null) => {
  if (!value) return null;
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2})(?:\.(\d{1,9}))?)?(Z|[+-]\d{2}:\d{2})?$/);
  if (!match) return null;

  const [, year, month, day, hour, minute, second, , offset] = match;
  const yearNumber = Number(year);
  const monthNumber = Number(month);
  const leapYear = yearNumber % 4 === 0 && (yearNumber % 100 !== 0 || yearNumber % 400 === 0);
  const daysInMonth = [31, leapYear ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  if (yearNumber === 0 || monthNumber < 1 || monthNumber > 12 ||
    Number(day) < 1 || Number(day) > daysInMonth[monthNumber - 1] ||
    Number(hour) > 23 || Number(minute) > 59 || Number(second ?? 0) > 59) return null;

  if (!offset) return `${year}.${month}.${day} ${hour}:${minute} 분석 완료`;
  if (offset !== "Z" && (Number(offset.slice(1, 3)) > 23 || Number(offset.slice(4)) > 59)) return null;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  const parts = new Intl.DateTimeFormat("en", {
    timeZone: "Asia/Seoul", year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", hourCycle: "h23",
  }).formatToParts(date);
  const part = (type: Intl.DateTimeFormatPartTypes) => parts.find((item) => item.type === type)?.value;
  return `${part("year")?.padStart(4, "0")}.${part("month")}.${part("day")} ${part("hour")}:${part("minute")} 분석 완료`;
};
