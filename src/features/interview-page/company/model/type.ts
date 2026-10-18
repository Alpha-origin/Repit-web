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
  aliases: string[];
  category: CompanyCategory;
  legalSize: CompanyLegalSize | null; // null = 미확인. 표시하지 않음
  talentKeywords: string[]; // 인재상 짧은 이름, 최대 3개
  dataAsOf: string; // YYYY-MM-DD
}
