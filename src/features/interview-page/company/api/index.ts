import { apiInstance } from "@/shared/api/axiosInstance";
import type { CompanyCategory, CompanySummary } from "../model/type";
import { COMPANY_CATEGORY_ORDER } from "../model/companyLabels";

export const getCompanies = async (
  query: string,
  category: CompanyCategory | "ALL",
  signal?: AbortSignal,
): Promise<CompanySummary[]> => {
  const q = query.trim();
  const response = await apiInstance.get("/api/companies", {
    params: {
      ...(q.length >= 2 ? { q: q.slice(0, 30) } : {}),
      ...(category !== "ALL" ? { category } : {}),
    },
    signal,
    timeout: 15_000,
  });
  const data: unknown = Array.isArray(response.data) ? response.data : response.data?.data;
  if (!Array.isArray(data) || !data.every((item) =>
    item && Number.isSafeInteger(item.companyId) && item.companyId > 0 &&
    typeof item.displayName === "string" && item.displayName.trim() &&
    typeof item.legalName === "string" && COMPANY_CATEGORY_ORDER.includes(item.category) &&
    (item.legalSize === null || ["LARGE", "MID", "SMALL"].includes(item.legalSize)) &&
    Array.isArray(item.talentKeywords) && item.talentKeywords.every((title: unknown) => typeof title === "string") &&
    typeof item.dataAsOf === "string",
  )) throw new Error("기업 목록 응답을 확인하지 못했습니다.");
  return data;
};
