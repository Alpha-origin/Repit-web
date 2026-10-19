import { useCallback, useEffect, useRef, useState } from "react";
import { generateProfile, getLatestProfile, type LatestProfile } from "../api";
import { extractErrorMessage } from "@/shared/api/errorMessage";

export const useProfileStatus = () => {
  const [profile, setProfile] = useState<LatestProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorAction, setErrorAction] = useState<"refresh" | "reanalyze">("refresh");
  const [isRestarting, setIsRestarting] = useState(false);
  const requestRef = useRef<AbortController | null>(null);
  const restartRef = useRef<AbortController | null>(null);
  const isInvalidatedRef = useRef(false);
  const lastJobIdRef = useRef<string | null>(null);
  const pendingJobRef = useRef<{
    jobId: string | null;
    previousJobId: string | null;
    observedPending: boolean;
  } | null>(null);

  const refetch = useCallback(async () => {
    if (isInvalidatedRef.current) return;
    requestRef.current?.abort();
    const controller = new AbortController();
    requestRef.current = controller;
    try {
      const latest = await getLatestProfile(controller.signal);
      if (controller.signal.aborted) return;
      const pending = pendingJobRef.current;
      // 새 분석 요청 직후에는 latest가 아직 이전 분석 결과를 반환할 수 있다.
      if (pending && (
        latest.status === "NONE" ||
        (pending.jobId !== null && latest.jobId !== pending.jobId) ||
        (pending.jobId === null && !pending.observedPending && latest.status !== "PENDING" && latest.jobId === pending.previousJobId)
      )) return;
      if (pending && latest.status === "PENDING") {
        pendingJobRef.current = { ...pending, jobId: latest.jobId, observedPending: true };
      }
      if (latest.status !== "PENDING") pendingJobRef.current = null;
      lastJobIdRef.current = latest.jobId;
      setProfile(latest);
      setErrorMessage("");
    } catch (error) {
      if (!controller.signal.aborted) {
        setErrorAction("refresh");
        setErrorMessage(extractErrorMessage(error, "자료 분석 상태를 확인하지 못했습니다."));
      }
    } finally {
      if (!controller.signal.aborted) {
        requestRef.current = null;
        setIsLoading(false);
      }
    }
  }, []);

  const markPending = useCallback((jobId: string | null) => {
    requestRef.current?.abort();
    isInvalidatedRef.current = false;
    pendingJobRef.current = { jobId, previousJobId: lastJobIdRef.current, observedPending: false };
    setProfile({
      jobId,
      status: "PENDING",
      errorStatusCode: null,
      errorMessage: null,
      failureReason: null,
      completedAt: null,
      projectSummary: null,
    });
    setIsLoading(false);
    setErrorMessage("");
    void refetch();
  }, [refetch]);

  const invalidate = useCallback(() => {
    requestRef.current?.abort();
    isInvalidatedRef.current = true;
    pendingJobRef.current = null;
    setProfile(null);
    setIsLoading(false);
    setErrorMessage("");
  }, []);

  useEffect(() => {
    void refetch();
    return () => {
      requestRef.current?.abort();
      restartRef.current?.abort();
    };
  }, [refetch]);

  useEffect(() => {
    if (profile?.status !== "PENDING") return;
    const timer = window.setInterval(() => {
      if (!requestRef.current || requestRef.current.signal.aborted) void refetch();
    }, 5_000);
    return () => window.clearInterval(timer);
  }, [profile?.status, refetch]);

  const reanalyze = async () => {
    if (restartRef.current || profile?.status === "PENDING") return false;
    const controller = new AbortController();
    restartRef.current = controller;
    setIsRestarting(true);
    setErrorMessage("");
    try {
      const jobId = await generateProfile(controller.signal);
      if (!controller.signal.aborted) {
        markPending(jobId);
        return true;
      }
    } catch (error) {
      if (!controller.signal.aborted) {
        setErrorAction("reanalyze");
        setErrorMessage(extractErrorMessage(error, "자료 분석을 다시 요청하지 못했습니다."));
      }
    } finally {
      if (!controller.signal.aborted) {
        restartRef.current = null;
        setIsRestarting(false);
      }
    }
    return false;
  };

  return { profile, isLoading, errorMessage, errorAction, isRestarting, refetch, markPending, invalidate, reanalyze };
};
