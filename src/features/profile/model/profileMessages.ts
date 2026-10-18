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

export { formatProfileCompletedAt } from "./profileCompletedAt";
