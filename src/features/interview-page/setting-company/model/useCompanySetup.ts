import { useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { extractErrorMessage } from "@/shared/api/errorMessage";
import { SAMPLE_COMPANIES } from "@/features/interview-page/company/model/sampleCompanies";
import type { CompanyCategory } from "@/features/interview-page/company/model/type";
import { submitSoloInterview } from "@/features/interview-page/setting-interview/model/submitSoloInterview";
import { submitMultiInterview } from "@/features/interview-page/setting-multi-interview/model/submitMultiInterview";
import { readInterviewDraft, type SubmitInterviewResult } from "./draft";

export type CompanyCategoryFilter = CompanyCategory | "ALL";

const MIN_QUERY_LENGTH = 2;

const matchesQuery = (values: string[], query: string) => {
  const normalized = query.trim().toLowerCase();
  if (normalized.length < MIN_QUERY_LENGTH) return true;
  return values.some((value) => value.toLowerCase().includes(normalized));
};

export const useCompanySetup = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [draft] = useState(() => readInterviewDraft(location.state));
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<CompanyCategoryFilter>("ALL");
  const [selectedCompanyId, setSelectedCompanyId] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [requiresMaterials, setRequiresMaterials] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submittingRef = useRef(false);

  const selectedCompany =
    SAMPLE_COMPANIES.find((company) => company.companyId === selectedCompanyId) ?? null;

  // 임시: 목록 API가 붙기 전까지 샘플 기업을 클라이언트에서 거른다.
  // 고른 기업은 필터에 걸려도 맨 앞에 남겨 선택 상태가 화면에서 사라지지 않게 한다.
  const companies = useMemo(() => {
    const filtered = SAMPLE_COMPANIES.filter(
      (company) =>
        (category === "ALL" || company.category === category) &&
        matchesQuery(
          [company.displayName, company.legalName, ...company.aliases],
          query,
        ),
    );
    return selectedCompany && !filtered.includes(selectedCompany)
      ? [selectedCompany, ...filtered]
      : filtered;
  }, [category, query, selectedCompany]);

  const selectCompany = (companyId: number | null) => {
    if (submittingRef.current) return;
    setSelectedCompanyId((previous) => (previous === companyId ? null : companyId));
  };

  const handleStart = async () => {
    if (!draft || submittingRef.current) return;
    submittingRef.current = true;
    setIsSubmitting(true);
    setErrorMessage("");
    setRequiresMaterials(false);

    // 임시: 서버 계약(companyId)이 병합되기 전이라 선택한 기업은 아직 보내지 않는다.
    const result: SubmitInterviewResult = await (draft.mode === "SOLO"
      ? submitSoloInterview(draft)
      : submitMultiInterview(draft)
    ).catch((error: unknown) => ({
      ok: false as const,
      errorMessage: extractErrorMessage(error, "면접 시작에 실패했습니다."),
      requiresMaterials: false,
    }));

    if ("errorMessage" in result) {
      submittingRef.current = false;
      setIsSubmitting(false);
      setErrorMessage(result.errorMessage);
      setRequiresMaterials(result.requiresMaterials);
      return;
    }

    setIsSubmitting(false);
    navigate(result.path, { state: result.state });
  };

  return {
    hasDraft: draft !== null,
    query,
    onQueryChange: (value: string) => {
      if (!submittingRef.current) setQuery(value);
    },
    category,
    onCategoryChange: (value: CompanyCategoryFilter) => {
      if (!submittingRef.current) setCategory(value);
    },
    companies,
    selectedCompany,
    selectedCompanyId,
    selectCompany,
    errorMessage,
    showMyPageLink: requiresMaterials,
    isSubmitting,
    onBack: () => navigate(-1),
    onStart: handleStart,
  };
};
