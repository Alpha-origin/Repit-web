import type { Materials } from "@/features/my-page/api/materials";
import { getGithubRule, getJobRole } from "@/shared/constants/job/jobRoles";

// 직무를 고르지 않은 옛 사용자는 개발 직무 규칙(포트폴리오·GitHub 필수)으로 본다(01 가정 A-7).
const LEGACY_REQUIRED_DOCUMENTS = ["PORTFOLIO"] as const;

export const getRequiredDocuments = (jobRole: string | null | undefined): readonly string[] =>
  getJobRole(jobRole)?.requiredDocuments ?? LEGACY_REQUIRED_DOCUMENTS;

// 06-web §4: 직무의 필수 종류 문서 1개 이상, GitHub 필수 직무는 GitHub 1개 이상.
export const checkMaterials = (materials: Materials) => {
  if (getJobRole(materials.jobRole)?.materialRule === "NON_RESUME_OR_COVER_LETTER") {
    const hasNonResumeDocument = materials.documents.some((document) =>
      ["CAREER_DESCRIPTION", "PORTFOLIO", "WORK_SAMPLE"].includes(document.type));
    const hasCoverLetter = materials.coverLetters.some(({ question, answer }) =>
      question.trim() && answer.trim());
    const hasRequiredDocument = hasNonResumeDocument || hasCoverLetter;
    return {
      hasAnyMaterial: materials.documents.length > 0 || hasCoverLetter,
      hasRequiredDocument,
      isGithubMissing: false,
      isSatisfied: Boolean(materials.jobTitle?.trim()) && hasRequiredDocument,
    };
  }
  const requiredDocuments = getRequiredDocuments(materials.jobRole);
  const hasRequiredDocument = materials.documents.some((document) =>
    requiredDocuments.includes(document.type));
  const hasGithub = materials.gitUrls.some((url) => url.trim());
  const isGithubMissing = getGithubRule(materials.jobRole) === "REQUIRED" && !hasGithub;

  return {
    hasAnyMaterial: materials.documents.length > 0 || hasGithub,
    hasRequiredDocument,
    isGithubMissing,
    isSatisfied: hasRequiredDocument && !isGithubMissing,
  };
};
