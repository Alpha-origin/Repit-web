import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { INTERVIEW_PREPARATION_POLL_INTERVAL_MS, INTERVIEW_QUESTIONS_WAITING_POLL_INTERVAL_MS, INTERVIEW_PREPARATION_TIMEOUT_MS } from "@/shared/constants/interview-page/interview";
import { getCreatedInterview } from "@/features/interview-page/interview/api/create-interview";
import { getInterviewPreparation, prepareInterviewRecord, retryInterviewPreparation } from "@/features/interview-page/interview/api";
import { extractErrorMessage } from "@/shared/api/errorMessage";
import { loadSetupDraft, useSetupDraftStore } from "./draftStore";
import { submitSetupDraft } from "./submitDraft";
import { buildPreparedView } from "./prepareView";
import { COMPANY_SETTING_PATH } from "./draft";

export const useInterviewPreparation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const draftId = new URLSearchParams(location.search).get("draftId");
  useSetupDraftStore((state) => draftId ? state.drafts[draftId] : undefined);
  const draft = loadSetupDraft(draftId);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [canRetryPreparation, setCanRetryPreparation] = useState(false);
  const [showMyPageLink, setShowMyPageLink] = useState(false);
  const [preparationAttempt, setPreparationAttempt] = useState(0);
  const busy = useRef(false);
  const mounted = useRef(true);
  useEffect(() => { mounted.current = true; return () => { mounted.current = false; }; }, []);
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

  // 최초 진입은 생성하고, 새로고침은 저장된 본문과 멱등 키로 복구한다.
  useEffect(() => {
    const initial = loadSetupDraft(draftId);
    if (!initial || initial.submission?.interviewId) return;
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
        setErrorMessage(extractErrorMessage(error, "면접 준비 상태를 확인하지 못했습니다."));
      }
    };
    void poll();
    return () => { controller.abort(); window.clearTimeout(timer); };
  }, [interviewId, draftId, preparationAttempt, navigate]);

  const onRetryPreparation = async () => {
    if (!interviewId || busy.current) return;
    busy.current = true;
    setIsSubmitting(true);
    setErrorMessage("");
    try {
      if (canRetryPreparation) {
        const result = await retryInterviewPreparation(interviewId);
        if (result.errorMessage) throw new Error(result.errorMessage);
      }
      if (!mounted.current) return;
      setCanRetryPreparation(false);
      setPreparationAttempt((value) => value + 1);
    } catch (error) {
      if (mounted.current) setErrorMessage(extractErrorMessage(error, "면접 준비를 다시 요청하지 못했습니다."));
    } finally { busy.current = false; if (mounted.current) setIsSubmitting(false); }
  };

  return {
    draft, errorMessage, isSubmitting, showMyPageLink,
    canRetryPreparation, onRetryPreparation, onStart: handleStart,
    onBack: () => { if (draft && !draft.submission && !busy.current) void navigate(`${COMPANY_SETTING_PATH}?draftId=${draft.draftId}`, { replace: true }); },
  };
};
