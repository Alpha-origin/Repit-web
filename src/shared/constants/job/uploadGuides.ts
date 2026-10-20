import type { JobRoleCode } from "./jobRoles";

// job-family-decisions 「안내 문구」 기준. 개발 직무와 안내가 없는 직무는 공통 문구만 쓴다.
export const COMMON_UPLOAD_GUIDE = "이미지로 내보낸 PDF는 인식이 어려울 수 있습니다.";

export const UPLOAD_GUIDES: Partial<Record<JobRoleCode, string>> = {
  GEN_STRATEGY: "사업계획서·분석 보고서처럼 본인이 세운 계획과 그 근거가 드러나는 문서를 올려 주세요.",
  GEN_HR_ADMIN: "기획·운영한 제도, 교육, 채용 내용이 드러나는 문서가 좋습니다. 구성원 개인정보는 가려 주세요.",
  GEN_FINANCE: "맡은 업무 범위와 처리 기준이 드러나는 경력기술서·분석 보고서가 좋습니다. 공개되지 않은 회사 수치는 가려 주세요.",
  GEN_MARKETING: "캠페인의 목표, 실행, 결과 수치가 함께 드러나는 자료가 좋습니다.",
  GEN_SALES: "담당 고객, 제안, 실적이 드러나는 경력기술서가 좋습니다. 고객사 정보는 가려 주세요.",
  GEN_DESIGN: "작업마다 문제, 본인 역할, 결정 이유를 글로 함께 적어 주세요. 결과물의 미적 완성도는 평가하지 않아요.",
  DATA_ANALYST: "문제 정의, 데이터, 분석 방법, 결과, 의사결정 연결이 드러나는 리포트를 올려 주세요.",
  QA_ENGINEER: "케이스 ID·절차·기대 결과가 있는 테스트 케이스가 좋습니다. 엑셀은 PDF로 내보내서 올려 주세요.",
  SECURITY: "발견, 재현, 영향, 대응 순서로 쓴 보고서가 좋습니다. 블로그 글은 \"PDF로 인쇄\"로 올리고, 실제 기관의 취약점과 민감 정보는 가려 주세요.",
  PRODUCT_MANAGER: "글 위주 문서(PRD·정책서)를 먼저 올려 주세요. 화면설계서는 보조 자료입니다.",
  IT_CONSULTANT: "고객사 기밀 정보는 가려 주세요.",
};

export const getUploadGuides = (code: string | null | undefined) => {
  const guide = UPLOAD_GUIDES[code as JobRoleCode];
  return guide ? [guide, COMMON_UPLOAD_GUIDE] : [COMMON_UPLOAD_GUIDE];
};
