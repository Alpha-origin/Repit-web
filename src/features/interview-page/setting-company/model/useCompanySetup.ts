import { INTERVIEW_PREPARATION_POLL_INTERVAL_MS, INTERVIEW_QUESTIONS_WAITING_POLL_INTERVAL_MS, INTERVIEW_PREPARATION_TIMEOUT_MS } from "@/shared/constants/interview-page/interview";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getCompanies } from "@/features/interview-page/company/api";
import type { CompanyCategory, CompanySummary } from "@/features/interview-page/company/model/type";
import { getCreatedInterview } from "@/features/interview-page/interview/api/create-interview";
import { getInterviewPreparation, prepareInterviewRecord, retryInterviewPreparation } from "@/features/interview-page/interview/api";
import { extractErrorMessage } from "@/shared/api/errorMessage";
import { loadSetupDraft, saveSetupDraft, useSetupDraftStore } from "./draftStore";
import { submitSetupDraft } from "./submitDraft";
import { buildPreparedView } from "./prepareView";

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [preparationState, setPreparationState] = useState<"PREPARING" | "PREPARATION_FAILED" | null>(null);
  const [canRetryPreparation, setCanRetryPreparation] = useState(false);
  const [showMyPageLink, setShowMyPageLink] = useState(false);
  const [preparationAttempt, setPreparationAttempt] = useState(0);
  // 처음 받은 필터 없는 목록이 비었으면 선택 화면 없이 바로 준비한다(05-web §3-3 C0-1). null = 아직 판정 전.
  const [skipMode, setSkipMode] = useState<boolean | null>(null);
  const autoStarted = useRef(false);
  const busy = useRef(false);
  const mounted = useRef(true);
  useEffect(() => { mounted.current = true; return () => { mounted.current = false; }; }, []);

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

  const handleStart = async () => {
    if (!draftId || busy.current) return;
    busy.current = true;
    setIsSubmitting(true);
    setErrorMessage("");
    try {
      await submitSetupDraft(draftId);
    } catch (error) {
      if (mounted.current) setErrorMessage(extractErrorMessage(error, "면접 생성 결과를 확인하지 못했습니다."));
    } finally {
      busy.current = false;
      if (mounted.current) setIsSubmitting(false);
    }
  };

  // 건너뛰기 모드: 아직 제출하지 않았고 기업을 고른 적 없는 초안이면 "기업 없이 면접 시작"을 한 번만 자동 실행한다(C0-2).
  const skipStep = skipMode === true && draft?.companyId === null;
  useEffect(() => {
    if (!skipStep || autoStarted.current || !draft || draft.submission) return;
    autoStarted.current = true;
    void handleStart();
  });

  // 제출 중 새로고침/재진입에서는 새 본문을 만들지 않고 저장된 요청만 복구한다.
  useEffect(() => {
    const initial = loadSetupDraft(draftId);
    if (!initial?.submission || initial.submission.interviewId) return;
    let cancelled = false;
    const timer = window.setTimeout(() => {
      busy.current = true;
      setIsSubmitting(true);
      void submitSetupDraft(initial.draftId).catch((error: unknown) => {
        if (!cancelled) setErrorMessage(extractErrorMessage(error, "면접 생성 결과를 확인하지 못했습니다."));
      }).finally(() => {
        busy.current = false;
        if (!cancelled) setIsSubmitting(false);
      });
    }, 0);
    return () => { cancelled = true; window.clearTimeout(timer); };
  }, [draftId]);

  const interviewId = draft?.submission?.interviewId;
  useEffect(() => {
    if (!interviewId || !draftId) return;
    const controller = new AbortController();
    let timer: number | undefined;
    let requestedStart = false;
    const deadline = Date.now() + INTERVIEW_PREPARATION_TIMEOUT_MS;
    const poll = async () => {
      try {
        const saved = loadSetupDraft(draftId);
        if (!saved?.submission || saved.submission.interviewId !== interviewId) return;
        setPreparationState("PREPARING");
        setErrorMessage("");
        setShowMyPageLink(false);
        const data = await getCreatedInterview(interviewId, saved.submission.requestBody, controller.signal);
        if (controller.signal.aborted) return;
        if (String(data.userId) !== saved.ownerKey) throw new Error("면접 접근 권한이 없습니다.");
        if (data.status === "COMPLETED") {
          void navigate(`/main/feedback/overall/${interviewId}`, { replace: true });
          return;
        }
        if (data.status === "ABANDONED") throw new Error("종료된 면접입니다. 새 면접을 만들어주세요.");
        const result = await getInterviewPreparation(interviewId, controller.signal);
        if (controller.signal.aborted) return;
        if (!result.data) throw new Error(result.errorMessage ?? "면접 준비 상태를 확인하지 못했습니다.");
        const preparation = result.data;
        if (preparation.preparationStatus === "READY" && preparation.chatDelivered) {
          const preparedInterview = buildPreparedView(saved.settings, data);
          void navigate(`/main/interview/${interviewId}?draftId=${draftId}`, { replace: true, state: { preparedInterview } });
          return;
        }
        if (preparation.preparationStatus === "FAILED") {
          setCanRetryPreparation(preparation.retryable);
          throw new Error(preparation.errorMessage ?? "면접 준비에 실패했습니다.");
        }
        if (preparation.preparationStatus === "NOT_REQUESTED" && !requestedStart) {
          requestedStart = true;
          const started = await prepareInterviewRecord(interviewId, controller.signal);
          if (controller.signal.aborted) return;
          if (!started.data) {
            // 자료가 없어 준비할 수 없으면(404) 마이페이지 안내를 함께 보여 준다.
            setShowMyPageLink(started.statusCode === 404);
            throw new Error(started.errorMessage ?? "면접 준비 요청을 확인하지 못했습니다.");
          }
        }
        if (Date.now() >= deadline) throw new Error("면접 준비가 지연되고 있습니다. 저장된 면접의 준비 상태를 다시 확인해주세요.");
        const interval = preparation.status === "WAITING"
          ? INTERVIEW_QUESTIONS_WAITING_POLL_INTERVAL_MS : INTERVIEW_PREPARATION_POLL_INTERVAL_MS;
        const delay = Math.max(interval, preparation.retryAfterMs ?? 0);
        timer = window.setTimeout(() => void poll(), Math.min(delay, Math.max(0, deadline - Date.now())));
      } catch (error) {
        if (controller.signal.aborted) return;
        setPreparationState("PREPARATION_FAILED");
        setErrorMessage(extractErrorMessage(error, "면접 준비 상태를 확인하지 못했습니다."));
      }
    };
    void poll();
    return () => { controller.abort(); window.clearTimeout(timer); };
  }, [interviewId, draftId, preparationAttempt, navigate]);

  const locked = isSubmitting || !!draft?.submission;
  const onRetryPreparation = async () => {
    if (!interviewId || busy.current) return;
    busy.current = true;
    setIsSubmitting(true);
    try {
      if (canRetryPreparation) {
        const result = await retryInterviewPreparation(interviewId);
        if (result.errorMessage) throw new Error(result.errorMessage);
      }
      setCanRetryPreparation(false);
      setPreparationAttempt((value) => value + 1);
    } catch (error) {
      setErrorMessage(extractErrorMessage(error, "면접 준비를 다시 요청하지 못했습니다."));
    } finally { busy.current = false; setIsSubmitting(false); }
  };

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
    errorMessage, showMyPageLink, isSubmitting, locked, preparationState, canRetryPreparation, onRetryPreparation,
    onBack: () => {
      if (locked || !draft) return;
      void navigate(`/main/setting/interview${draft.mode === "MULTI" ? "/multi" : ""}?draftId=${draft.draftId}`);
    },
    onStart: handleStart,
  };
};
