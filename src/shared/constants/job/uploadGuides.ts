import type { JobRoleCode } from "./jobRoles";

// job-family-decisions 「안내 문구」 기준. 개발 직무와 안내가 없는 직무는 공통 문구만 쓴다.
export const COMMON_UPLOAD_GUIDE = "이미지로 내보낸 PDF는 인식이 어려울 수 있습니다.";

export const UPLOAD_GUIDES: Partial<Record<JobRoleCode, string>> = {
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
