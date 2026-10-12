import { useCallback, useEffect, useRef, useState } from "react";
import { generateProfile, getLatestProfile, type LatestProfile } from "../api";
import { extractErrorMessage } from "@/shared/api/errorMessage";

export const useProfileStatus = () => {
  const [profile, setProfile] = useState<LatestProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [isRestarting, setIsRestarting] = useState(false);
  const requestRef = useRef<AbortController | null>(null);
  const restartRef = useRef<AbortController | null>(null);

  const refetch = useCallback(async () => {
    requestRef.current?.abort();
    const controller = new AbortController();
    requestRef.current = controller;
    try {
      const latest = await getLatestProfile(controller.signal);
      if (controller.signal.aborted) return;
      setProfile(latest);
      setErrorMessage("");
    } catch (error) {
      if (!controller.signal.aborted) {
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
    if (restartRef.current || profile?.status === "PENDING") return;
    const controller = new AbortController();
    restartRef.current = controller;
    setIsRestarting(true);
    setErrorMessage("");
    try {
      const jobId = await generateProfile(controller.signal);
      if (!controller.signal.aborted) markPending(jobId);
    } catch (error) {
      if (!controller.signal.aborted) {
        setErrorMessage(extractErrorMessage(error, "자료 분석을 다시 요청하지 못했습니다."));
      }
    } finally {
      if (!controller.signal.aborted) {
        restartRef.current = null;
        setIsRestarting(false);
      }
    }
  };

  return { profile, isLoading, errorMessage, isRestarting, refetch, markPending, reanalyze };
};
