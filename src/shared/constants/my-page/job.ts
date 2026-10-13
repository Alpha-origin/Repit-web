export const JOB_CATEGORIES = [
  { value: "DEVELOPMENT", label: "개발" },
  { value: "NON_DEVELOPMENT", label: "비개발" },
] as const;

export type JobCategory = (typeof JOB_CATEGORIES)[number]["value"];

// 직무 저장 API 연결 전 화면에서 사용하는 선택 항목이다.
export const JOB_OPTIONS = {
  DEVELOPMENT: [
    { value: "FRONTEND", label: "프론트엔드" },
    { value: "BACKEND", label: "백엔드" },
    { value: "FULLSTACK", label: "풀스택" },
    { value: "MOBILE", label: "모바일" },
    { value: "DATA_AI", label: "데이터·AI" },
    { value: "DEVOPS", label: "인프라·DevOps" },
  ],
  NON_DEVELOPMENT: [
    { value: "DESIGN", label: "디자인" },
    { value: "PRODUCT", label: "기획·PM" },
    { value: "MARKETING", label: "마케팅" },
    { value: "SALES", label: "영업·사업개발" },
    { value: "HR", label: "인사" },
    { value: "FINANCE", label: "재무·회계" },
  ],
} as const;
