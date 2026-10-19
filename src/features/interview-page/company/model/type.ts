export type CompanyCategory =
  | "IT_SERVICE"
  | "PLATFORM"
  | "FINTECH"
  | "GAME"
  | "CONSUMER"
  | "SECURITY";

export type CompanyLegalSize = "LARGE" | "MID" | "SMALL";

export interface CompanySummary {
  companyId: number;
  displayName: string;
  legalName: string;
  aliases?: string[];
  category: CompanyCategory;
  legalSize: CompanyLegalSize | null; // null = 미확인. 표시하지 않음
  talentKeywords: string[]; // 인재상 짧은 이름, 최대 3개
  dataAsOf: string; // YYYY-MM-DD
}

export interface CompanyBadge {
  companyId: number;
  displayName: string;
}

export const readCompanyBadge = (value: unknown): CompanyBadge | null => {
  if (!value || typeof value !== "object") return null;
  const item = value as Record<string, unknown>;
  return typeof item.companyId === "number" && Number.isSafeInteger(item.companyId) && item.companyId > 0 &&
    typeof item.displayName === "string" && item.displayName.trim().length > 0 && [...item.displayName.trim()].length <= 30
    ? { companyId: item.companyId, displayName: item.displayName.trim() } : null;
};
