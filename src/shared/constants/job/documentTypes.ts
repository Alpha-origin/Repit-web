// 01-overview §3 / job-family-decisions 「문서 종류 코드」 기준. 서버 코드와 같아야 한다.
export const DOCUMENT_TYPES = [
  { code: "RESUME", label: "이력서" },
  { code: "CAREER_DESCRIPTION", label: "경력기술서" },
  { code: "PORTFOLIO", label: "포트폴리오" },
  { code: "ANALYSIS_REPORT", label: "분석 리포트" },
  { code: "COMPETITION_SUMMARY", label: "대회 결과 요약" },
  { code: "INCIDENT_REPORT", label: "장애 대응 보고서" },
  { code: "TABLE_SPEC", label: "테이블 정의서" },
  { code: "SYSTEM_ARCHITECTURE", label: "시스템 구성도" },
  { code: "TEST_PLAN", label: "테스트 계획서" },
  { code: "TEST_CASE", label: "테스트 케이스" },
  { code: "BUG_REPORT", label: "버그 리포트" },
  { code: "VULNERABILITY_REPORT", label: "취약점 분석 보고서" },
  { code: "CTF_WRITEUP", label: "CTF 풀이" },
  { code: "PRD", label: "기획서(PRD)" },
  { code: "POLICY_DOC", label: "정책서" },
  { code: "REQUIREMENT_SPEC", label: "요구사항 정의서" },
  { code: "SCREEN_SPEC", label: "화면설계서·플로우" },
  { code: "PROPOSAL", label: "제안서" },
  { code: "PROJECT_REPORT", label: "수행·결과 보고서" },
] as const;

export type DocumentTypeCode = (typeof DOCUMENT_TYPES)[number]["code"];

const DOCUMENT_TYPE_LABELS: Record<string, string> = Object.fromEntries(
  DOCUMENT_TYPES.map(({ code, label }) => [code, label]),
);

export const getDocumentTypeLabel = (code: string) => DOCUMENT_TYPE_LABELS[code] ?? code;
