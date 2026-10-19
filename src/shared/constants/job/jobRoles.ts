import type { DocumentTypeCode } from "./documentTypes";

// 01-overview §3.1 기준. 서버 코드(MAJOR_ 접두사 제외)와 같아야 한다.
export const JOB_CATEGORIES = [
  { value: "DEVELOPMENT", label: "개발" },
  { value: "NON_DEVELOPMENT", label: "비개발" },
] as const;

export type JobCategory = (typeof JOB_CATEGORIES)[number]["value"];
export type JobFamily = "개발" | "데이터·인프라" | "품질·보안" | "기획·비즈니스";
// REQUIRED: 1개 이상 필수 / OPTIONAL: 입력 가능 / HIDDEN: 영역 없음
export type GithubRule = "REQUIRED" | "OPTIONAL" | "HIDDEN";

export interface JobRole {
  code: string;
  label: string;
  category: JobCategory;
  family: JobFamily;
  github: GithubRule;
  requiredDocuments: readonly DocumentTypeCode[];
  optionalDocuments: readonly DocumentTypeCode[];
  hasSupplement: boolean;
}

// code를 리터럴로 유지해야 JobRoleCode가 9개 코드 유니온이 된다.
const dev = <const C extends string>(code: C, label: string) =>
  ({
    code, label, category: "DEVELOPMENT", family: "개발", github: "REQUIRED",
    requiredDocuments: ["PORTFOLIO"], optionalDocuments: [], hasSupplement: false,
  }) as const;

export const JOB_ROLES = [
  dev("FRONTEND", "프론트엔드"),
  dev("BACKEND", "백엔드"),
  dev("WEB_PUBLISHER", "웹 퍼블리셔"),
  {
    code: "DATA_ANALYST", label: "데이터 분석가", category: "NON_DEVELOPMENT", family: "데이터·인프라",
    github: "HIDDEN", requiredDocuments: ["PORTFOLIO", "ANALYSIS_REPORT"],
    optionalDocuments: ["COMPETITION_SUMMARY"], hasSupplement: true,
  },
  {
    code: "DBA_INFRA", label: "DBA·인프라 엔지니어", category: "NON_DEVELOPMENT", family: "데이터·인프라",
    github: "HIDDEN", requiredDocuments: ["PORTFOLIO", "CAREER_DESCRIPTION"],
    optionalDocuments: ["INCIDENT_REPORT", "TABLE_SPEC", "SYSTEM_ARCHITECTURE"], hasSupplement: true,
  },
  {
    code: "QA_ENGINEER", label: "QA 엔지니어", category: "NON_DEVELOPMENT", family: "품질·보안",
    github: "HIDDEN", requiredDocuments: ["TEST_PLAN", "TEST_CASE"],
    optionalDocuments: ["PORTFOLIO", "BUG_REPORT"], hasSupplement: true,
  },
  {
    code: "SECURITY", label: "정보보안", category: "NON_DEVELOPMENT", family: "품질·보안",
    github: "HIDDEN", requiredDocuments: ["VULNERABILITY_REPORT", "CTF_WRITEUP"],
    optionalDocuments: ["PORTFOLIO"], hasSupplement: true,
  },
  {
    code: "PRODUCT_MANAGER", label: "서비스 기획자 (PM·PO)", category: "NON_DEVELOPMENT", family: "기획·비즈니스",
    github: "HIDDEN", requiredDocuments: ["PRD", "POLICY_DOC", "REQUIREMENT_SPEC"],
    optionalDocuments: ["PORTFOLIO", "SCREEN_SPEC"], hasSupplement: true,
  },
  {
    code: "IT_CONSULTANT", label: "IT 컨설턴트·기술영업", category: "NON_DEVELOPMENT", family: "기획·비즈니스",
    github: "HIDDEN", requiredDocuments: ["CAREER_DESCRIPTION", "PORTFOLIO"],
    optionalDocuments: ["PROPOSAL", "PROJECT_REPORT", "REQUIREMENT_SPEC"], hasSupplement: true,
  },
] as const satisfies readonly JobRole[];

export type JobRoleCode = (typeof JOB_ROLES)[number]["code"];

export const NON_DEVELOPMENT_FAMILIES = ["데이터·인프라", "품질·보안", "기획·비즈니스"] as const;

export const getJobRole = (code: string | null | undefined): JobRole | undefined =>
  JOB_ROLES.find((role) => role.code === code);

export const getJobRolesByCategory = (category: JobCategory): readonly JobRole[] =>
  JOB_ROLES.filter((role) => role.category === category);

export const getJobRoleLabel = (code: string | null | undefined) =>
  getJobRole(code)?.label ?? code ?? "";

// 직무를 고르지 않은 옛 사용자는 개발 직무(GitHub 필수)로 본다(01 가정 A-7).
export const getGithubRule = (code: string | null | undefined): GithubRule =>
  getJobRole(code)?.github ?? "REQUIRED";
