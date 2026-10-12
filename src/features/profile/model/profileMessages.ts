import type { LatestProfile, ProfileFailureReason } from "../api";

export const PROFILE_FAILURE_MESSAGES: Record<ProfileFailureReason, string> = {
  REPO_NOT_PUBLIC: "GitHub 저장소가 비공개라 읽을 수 없어요. public으로 바꾼 뒤 다시 저장해 주세요",
  INVALID_MATERIAL: "PDF를 열 수 없거나 GitHub 주소가 올바르지 않아요",
  INSUFFICIENT_EVIDENCE: "코드에서 질문 근거를 충분히 찾지 못했어요. 핵심 기능이 담긴 저장소를 추가하거나 포트폴리오를 보강해 주세요",
  INTERNAL: "분석 중 문제가 생겼어요",
};

export const getProfileFailureMessage = (profile: LatestProfile) =>
  (profile.failureReason && PROFILE_FAILURE_MESSAGES[profile.failureReason]) ||
  profile.errorMessage || PROFILE_FAILURE_MESSAGES.INTERNAL;
