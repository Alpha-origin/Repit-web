import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getCompanies } from "@/features/interview-page/company/api";
import type { CompanyCategory, CompanySummary } from "@/features/interview-page/company/model/type";
import { extractErrorMessage } from "@/shared/api/errorMessage";
import { loadSetupDraft, saveSetupDraft, useSetupDraftStore } from "./draftStore";
import { INTERVIEW_PREPARING_PATH } from "./draft";

export type CompanyCategoryFilter = CompanyCategory | "ALL";

export const useCompanySetup = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const draftId = new URLSearchParams(location.search).get("draftId");
  useSetupDraftStore((state) => draftId ? state.drafts[draftId] : undefined);
  const draft = loadSetupDraft(draftId);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [category, setCategory] = useState<CompanyCategoryFilter>("ALL");
  const [companies, setCompanies] = useState<CompanySummary[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<CompanySummary | null>(null);
  const [listState, setListState] = useState<"loading" | "success" | "error">("loading");
  const [listError, setListError] = useState("");
  const [listAttempt, setListAttempt] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [skipMode, setSkipMode] = useState<boolean | null>(null);
  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedQuery(query.trim()), 300);
    return () => window.clearTimeout(timer);
  }, [query]);

  const selectedCompanyId = draft?.companyId ?? null;
  const queryKey = JSON.stringify([debouncedQuery.length >= 2 ? debouncedQuery : "", category, listAttempt]);
  useEffect(() => {
    const controller = new AbortController();
    void (async () => {
      setListState("loading");
      setListError("");
      try {
        const result = await getCompanies(debouncedQuery, category, controller.signal);
        if (controller.signal.aborted) return;
        setCompanies(result);
        if (!debouncedQuery && category === "ALL") setSkipMode((previous) => previous ?? result.length === 0);
        setSelectedCompany((previous) => result.find((company) => company.companyId === selectedCompanyId) ?? previous);
        setListState("success");
      } catch (error) {
        if (controller.signal.aborted) return;
        setListState("error");
        // 목록 실패면 건너뛰지 않는다. 선택 화면이 오류와 "기업 없이 면접 시작"을 보여 준다(C0-4).
        setSkipMode((previous) => previous ?? false);
        setListError(extractErrorMessage(error, "기업 목록을 불러오지 못했습니다."));
      }
    })();
    return () => controller.abort();
  }, [debouncedQuery, category, queryKey, selectedCompanyId]);

  const locked = !!draft?.submission;
  const skipStep = skipMode === true && draft?.companyId === null;
  useEffect(() => {
    if (!draftId || (!skipStep && !locked)) return;
    void navigate(`${INTERVIEW_PREPARING_PATH}?draftId=${draftId}`, { replace: true });
  }, [draftId, skipStep, locked, navigate]);

  return {
    hasDraft: !!draft, draft, skipStep, isDecidingSkip: skipMode === null, query, category, companies, selectedCompanyId,
    selectedCompany: selectedCompany?.companyId === selectedCompanyId ? selectedCompany : null,
    onQueryChange: (value: string) => { if (!locked) setQuery(value.slice(0, 30)); },
    onCategoryChange: (value: CompanyCategoryFilter) => { if (!locked) setCategory(value); },
    selectCompany: (companyId: number | null) => {
      if (locked || !draft) return;
      try {
        saveSetupDraft({ ...draft, companyId, updatedAt: new Date().toISOString() });
        setSelectedCompany(companies.find((company) => company.companyId === companyId) ?? null);
        setErrorMessage("");
      } catch (error) { setErrorMessage(extractErrorMessage(error, "기업 선택을 저장하지 못했습니다.")); }
    },
    listState, listError,
    emptyMessage: debouncedQuery.length >= 2 || category !== "ALL" ? "검색 결과가 없어요" : "현재 등록된 기업이 없습니다. 기업 없이 면접을 시작할 수 있어요.",
    onRetryList: () => setListAttempt((value) => value + 1),
    errorMessage, locked,
    onBack: () => {
      if (locked || !draft) return;
      void navigate(`/main/setting/interview${draft.mode === "MULTI" ? "/multi" : ""}?draftId=${draft.draftId}`);
    },
    onStart: () => { if (draft) void navigate(`${INTERVIEW_PREPARING_PATH}?draftId=${draft.draftId}`); },
  };
};
