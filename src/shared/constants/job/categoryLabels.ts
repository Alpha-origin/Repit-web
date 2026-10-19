import type { JobRoleCode } from "./jobRoles";

// 01-overview §3.2 기준. 코드는 직무 안에서만 유일하다(automation은 DBA·인프라와 QA에 따로 있음).
// 개발 3직무는 현행 카테고리를 그대로 쓰므로 여기 두지 않는다.
export const CATEGORY_LABELS: Partial<Record<JobRoleCode, Record<string, string>>> = {
  DATA_ANALYST: {
    hypothesis: "문제·가설", data_prep: "수집·전처리", method: "분석 방법",
    interpretation: "해석·한계", impact: "의사결정 연결",
  },
  DBA_INFRA: {
    design: "설계", performance: "성능 개선", operations: "운영·모니터링",
    incident: "장애 대응", automation: "배포·자동화",
  },
  QA_ENGINEER: {
    test_design: "테스트 설계", defect_reporting: "결함 보고", release_judgment: "출시 판단",
    automation: "테스트 자동화", quality_process: "품질 프로세스",
  },
  SECURITY: {
    vuln_principle: "취약점 원리", analysis_process: "분석 과정", mitigation: "대응·완화",
    incident_response: "사고 대응", ethics_law: "윤리·법",
  },
  PRODUCT_MANAGER: {
    problem_definition: "문제 정의", prioritization: "우선순위", metrics: "지표",
    collaboration: "협업", retrospective: "회고",
  },
  IT_CONSULTANT: {
    requirement_analysis: "요구사항 분석", solution_design: "해결안 설계",
    client_communication: "고객 커뮤니케이션", delivery: "수행·납품", outcome: "성과",
  },
};

export const getCategoryLabel = (jobRole: string | null | undefined, category: string) =>
  CATEGORY_LABELS[jobRole as JobRoleCode]?.[category] ?? category;
