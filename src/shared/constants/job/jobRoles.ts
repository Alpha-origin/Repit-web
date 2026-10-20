import type { DocumentTypeCode } from "./documentTypes";

// 01-overview §3.1 기준. 서버 코드(MAJOR_ 접두사 제외)와 같아야 한다.
export const JOB_CATEGORIES = [
  { value: "DEVELOPMENT", label: "IT 개발" },
  { value: "NON_DEVELOPMENT", label: "IT 비개발" },
  { value: "GENERAL", label: "IT 외 일반" },
] as const;

export type JobCategory = (typeof JOB_CATEGORIES)[number]["value"];
export type JobFamily = "개발" | "데이터·인프라" | "품질·보안" | "기획·비즈니스" | "일반";
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
  hasCoverLetter: boolean;
  materialRule: "REQUIRED_TYPE" | "NON_RESUME_OR_COVER_LETTER";
  jobTitleExample?: string;
}

// code를 리터럴로 유지해야 JobRoleCode가 직무 코드 유니온이 된다.
const dev = <const C extends string>(code: C, label: string) =>
  ({
    code, label, category: "DEVELOPMENT", family: "개발", github: "REQUIRED",
    requiredDocuments: ["PORTFOLIO"], optionalDocuments: [], hasSupplement: false, hasCoverLetter: false, materialRule: "REQUIRED_TYPE",
  }) as const;

const general = <const C extends string>(code: C, label: string, example: string) =>
  ({
    code, label, category: "GENERAL", family: "일반", github: "HIDDEN",
    requiredDocuments: [], optionalDocuments: ["RESUME", "CAREER_DESCRIPTION", "PORTFOLIO", "WORK_SAMPLE"],
    hasSupplement: false, hasCoverLetter: true, materialRule: "NON_RESUME_OR_COVER_LETTER",
    jobTitleExample: example,
  }) as const;

export const JOB_ROLES = [
  dev("FRONTEND", "프론트엔드"),
  dev("BACKEND", "백엔드"),
  dev("WEB_PUBLISHER", "웹 퍼블리셔"),
  {
    code: "DATA_ANALYST", label: "데이터 분석가", category: "NON_DEVELOPMENT", family: "데이터·인프라",
    github: "OPTIONAL", requiredDocuments: ["PORTFOLIO", "ANALYSIS_REPORT"],
    optionalDocuments: ["COMPETITION_SUMMARY"], hasSupplement: false, hasCoverLetter: false, materialRule: "REQUIRED_TYPE",
  },
  {
    code: "DBA_INFRA", label: "DBA·인프라 엔지니어", category: "NON_DEVELOPMENT", family: "데이터·인프라",
    github: "OPTIONAL", requiredDocuments: ["PORTFOLIO", "CAREER_DESCRIPTION"],
    optionalDocuments: ["INCIDENT_REPORT", "TABLE_SPEC", "SYSTEM_ARCHITECTURE"], hasSupplement: false, hasCoverLetter: false, materialRule: "REQUIRED_TYPE",
  },
  {
    code: "QA_ENGINEER", label: "QA 엔지니어", category: "NON_DEVELOPMENT", family: "품질·보안",
    github: "OPTIONAL", requiredDocuments: ["TEST_PLAN", "TEST_CASE"],
    optionalDocuments: ["PORTFOLIO", "BUG_REPORT"], hasSupplement: false, hasCoverLetter: false, materialRule: "REQUIRED_TYPE",
  },
  {
    code: "SECURITY", label: "정보보안", category: "NON_DEVELOPMENT", family: "품질·보안",
    github: "OPTIONAL", requiredDocuments: ["VULNERABILITY_REPORT", "CTF_WRITEUP"],
    optionalDocuments: ["PORTFOLIO"], hasSupplement: false, hasCoverLetter: false, materialRule: "REQUIRED_TYPE",
  },
  {
    code: "PRODUCT_MANAGER", label: "서비스 기획자 (PM·PO)", category: "NON_DEVELOPMENT", family: "기획·비즈니스",
    github: "HIDDEN", requiredDocuments: ["PRD", "POLICY_DOC", "REQUIREMENT_SPEC"],
    optionalDocuments: ["PORTFOLIO", "SCREEN_SPEC"], hasSupplement: true, hasCoverLetter: false, materialRule: "REQUIRED_TYPE",
  },
  {
    code: "IT_CONSULTANT", label: "IT 컨설턴트·기술영업", category: "NON_DEVELOPMENT", family: "기획·비즈니스",
    github: "HIDDEN", requiredDocuments: ["CAREER_DESCRIPTION", "PORTFOLIO"],
    optionalDocuments: ["PROPOSAL", "PROJECT_REPORT", "REQUIREMENT_SPEC"], hasSupplement: true, hasCoverLetter: false, materialRule: "REQUIRED_TYPE",
  },
  general("GEN_STRATEGY", "경영기획·전략", "예: 경영기획, 사업기획, 전략기획"),
  general("GEN_HR_ADMIN", "인사·총무", "예: 채용 담당, 인사 운영, 총무"),
  general("GEN_FINANCE", "재무·회계", "예: 회계, 세무, 자금 관리"),
  general("GEN_MARKETING", "마케팅·홍보", "예: 퍼포먼스 마케터, 브랜드 마케터, PR"),
  general("GEN_SALES", "영업·고객관리", "예: B2B 영업, 영업관리, 고객 상담"),
  general("GEN_DESIGN", "디자인", "예: UX/UI 디자이너, 브랜드 디자이너"),
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

export const requiresJobTitle = (code: string | null | undefined) =>
  getJobRole(code)?.category === "GENERAL";

export const keepsMaterials = (from: string | null | undefined, to: string | null | undefined) =>
  from === to || (getJobRole(from)?.category === "DEVELOPMENT" && getJobRole(to)?.category === "DEVELOPMENT");
