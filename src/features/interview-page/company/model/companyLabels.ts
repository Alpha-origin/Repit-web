import type { CompanyCategory, CompanyLegalSize } from "./type";

export const COMPANY_CATEGORY_LABELS: Record<CompanyCategory, string> = {
  IT_SERVICE: "대기업 IT서비스",
  PLATFORM: "빅테크 플랫폼",
  FINTECH: "핀테크",
  GAME: "게임",
  CONSUMER: "커머스·모빌리티",
  SECURITY: "보안",
};

export const COMPANY_CATEGORY_ORDER: CompanyCategory[] = [
  "IT_SERVICE",
  "PLATFORM",
  "FINTECH",
  "GAME",
  "CONSUMER",
  "SECURITY",
];

export const COMPANY_LEGAL_SIZE_LABELS: Record<CompanyLegalSize, string> = {
  LARGE: "대기업",
  MID: "중견기업",
  SMALL: "중소기업",
};

export const COMPANY_DISCLAIMER =
  "공개 자료를 바탕으로 한 연습용 면접이며, 해당 기업과 무관합니다. 실제 채용 전형이나 기출 문제가 아닙니다.";

export const formatDataAsOf = (dataAsOf: string) => {
  const [year, month] = dataAsOf.split("-").map(Number);
  return year && month ? `${year}년 ${month}월 기준` : "";
};
