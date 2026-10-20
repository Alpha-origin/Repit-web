import type { JobRoleCode } from "./jobRoles";

// 01-overview §3.2 기준. 코드는 직무 안에서만 유일하다(automation은 DBA·인프라와 QA에 따로 있음).
// 개발 3직무는 현행 카테고리를 그대로 쓰므로 여기 두지 않는다.
export const CATEGORY_LABELS: Partial<Record<JobRoleCode, Record<string, string>>> = {
  GEN_STRATEGY: {
    market_analysis: "시장·환경 분석", business_plan: "사업 계획", budget_resource: "예산·자원 관리",
    execution: "실행 관리", performance: "성과 관리",
  },
  GEN_HR_ADMIN: {
    recruiting: "채용·배치", evaluation_reward: "평가·보상", training_culture: "교육·조직문화",
    labor_policy: "노무·규정", admin_support: "총무·운영 지원",
  },
  GEN_FINANCE: {
    closing: "결산·회계 처리", tax_compliance: "세무·법규", budget_cost: "예산·원가 관리",
    financial_analysis: "재무 분석·보고", treasury_risk: "자금·리스크 관리",
  },
  GEN_MARKETING: {
    market_customer: "시장·고객 분석", campaign_planning: "캠페인 기획", channel_execution: "채널·콘텐츠 실행",
    performance_measure: "성과 측정", brand_comms: "브랜드·대외 커뮤니케이션",
  },
  GEN_SALES: {
    prospecting: "고객 발굴", needs_proposal: "니즈 파악·제안", negotiation: "협상·계약",
    account_management: "고객 관계 관리", sales_performance: "실적 관리",
  },
  GEN_DESIGN: {
    research: "리서치·문제 정의", concept: "콘셉트·아이디어", design_decision: "디자인 결정",
    collaboration: "협업·피드백", validation: "결과 검증",
  },
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
