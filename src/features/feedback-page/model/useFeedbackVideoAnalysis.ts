import axios from "axios";
import { useCallback, useEffect, useRef, useState } from "react";
import { getVideoAnalysis } from "../api/getVideoAnalysis";
import { retryVideoAnalysis } from "../api/retryVideoAnalysis";
import { useRecordingUploadStore } from "@/features/interview-page/interview/model/interviewRecordingStore";
import { extractErrorMessage } from "@/shared/api/errorMessage";
import { VIDEO_FORMAT_ERROR } from "./validateVideoAnalysis";
import type { VideoAnalysis } from "./videoAnalysisTypes";

export interface FeedbackVideoView {
  visible: boolean;
  data: VideoAnalysis | null;
  notice: string | null;
  busy: boolean;
  uploadStatus: "UPLOADING" | "FAILED" | null;
}
const DELAY_MESSAGE = "분석이 지연되고 있습니다. 나중에 다시 확인해 주세요.";
const isPending = (data: VideoAnalysis | null) => data?.status === "WAITING" || data?.status === "ANALYZING";
const requestMessage = (error: unknown) => {
  if (error instanceof Error && error.message === VIDEO_FORMAT_ERROR) return VIDEO_FORMAT_ERROR;
  if (axios.isAxiosError(error)) {
    if (error.response?.status === 401 || error.response?.status === 403) return extractErrorMessage(error, "영상 분석 정보를 확인할 수 없습니다.");
    if (error.response?.status === 404) return "면접 정보 또는 영상 분석 API를 확인할 수 없습니다.";
  }
  return "영상 분석 정보를 확인하지 못했습니다. 다시 확인해 주세요.";
};

export const useFeedbackVideoAnalysis = (
  interviewId: number | undefined,
  answerMode: "TEXT" | "VOICE" | null | undefined,
  enabled: boolean,
  onPolicyError?: (error: unknown) => Promise<boolean>,
) => {
  const shouldLoad = import.meta.env.VITE_VIDEO_ANALYSIS_UI_ENABLED === "true" && enabled &&
    Number.isSafeInteger(interviewId) && (interviewId ?? 0) > 0 && answerMode !== "TEXT";
  const key = JSON.stringify([interviewId, answerMode ?? null, shouldLoad]);
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState<{ key: string; data: VideoAnalysis | null; notice: string | null; busy: boolean } | null>(null);
  const cache = useRef<{ key: string; data: VideoAnalysis | null } | null>(null);
  const retryCommand = useRef<(() => void) | null>(null);
  const jobs = useRecordingUploadStore((state) => state.jobs);
  const latestUpload = jobs.filter((job) => job.interviewId === interviewId && job.kind === "FULL_INTERVIEW").at(-1);
  const uploadStatus = latestUpload?.status === "UPLOADING" || latestUpload?.status === "FAILED" ? latestUpload.status : null;
  const uploadCompleted = latestUpload?.status === "SUCCEEDED" ? latestUpload.id : null;

  useEffect(() => {
    if (!shouldLoad || interviewId === undefined) return;
    const controller = new AbortController();
    let deadline = Date.now() + 10 * 60_000;
    let timer: number | undefined;
    let deadlineTimer: number | undefined;
    let inFlight = false;
    let stopped = false;
    let data = cache.current?.key === key ? cache.current.data : null;
    const update = (notice: string | null, busy: boolean) => {
      if (controller.signal.aborted) return;
      cache.current = { key, data };
      setState({ key, data, notice, busy });
    };
    const expire = () => {
      stopped = true;
      window.clearTimeout(timer);
      update(DELAY_MESSAGE, inFlight);
    };
    const poll = async (retry = false) => {
      if (controller.signal.aborted || inFlight || (!retry && stopped)) return;
      if (!retry && Date.now() >= deadline) { expire(); return; }
      inFlight = true;
      window.clearTimeout(timer);
      update(null, true);
      let reconciliationNotice: string | null = null;
      try {
        if (retry) {
          try {
            data = await retryVideoAnalysis(interviewId, controller.signal);
          } catch (error) {
            if (controller.signal.aborted) return;
            if (await onPolicyError?.(error)) { data = null; stopped = true; update(null, false); return; }
            if (controller.signal.aborted) return;
            if (axios.isAxiosError(error) && (error.response?.status === 401 || error.response?.status === 403)) throw error;
            reconciliationNotice = axios.isAxiosError(error) && error.response && error.response.status >= 400 && error.response.status < 500
              ? extractErrorMessage(error, "영상 재분석 요청을 접수하지 못했습니다. 최신 상태를 다시 확인했습니다.")
              : "재분석 요청의 접수 여부가 불확실해 최신 상태를 다시 확인했습니다.";
            // POST 응답 유실은 재전송하지 않고 GET으로 접수 상태를 확인한다.
            data = await getVideoAnalysis(interviewId, controller.signal);
            if (controller.signal.aborted) return;
          }
        } else {
          data = await getVideoAnalysis(interviewId, controller.signal);
        }
        if (controller.signal.aborted) return;
        update(reconciliationNotice, false);
        stopped = !isPending(data);
        if (!stopped && Date.now() >= deadline) expire();
        if (!stopped && document.visibilityState !== "hidden") timer = window.setTimeout(() => void poll(), 5_000);
      } catch (error) {
        if (controller.signal.aborted) return;
        if (await onPolicyError?.(error)) { data = null; stopped = true; update(null, false); return; }
        if (controller.signal.aborted) return;
        stopped = true;
        if (axios.isAxiosError(error) && (error.response?.status === 401 || error.response?.status === 403)) data = null;
        update(requestMessage(error), false);
      } finally {
        inFlight = false;
        if (stopped) window.clearTimeout(deadlineTimer);
      }
    };
    const onVisibility = () => {
      window.clearTimeout(timer);
      if (document.visibilityState !== "hidden" && !stopped) void poll();
    };
    retryCommand.current = () => {
      if (inFlight || controller.signal.aborted || !data?.canRetry) return;
      stopped = false;
      deadline = Date.now() + 10 * 60_000;
      window.clearTimeout(deadlineTimer);
      deadlineTimer = window.setTimeout(expire, 10 * 60_000);
      void poll(true);
    };
    document.addEventListener("visibilitychange", onVisibility);
    timer = window.setTimeout(() => {
      if (document.visibilityState !== "hidden") void poll();
    }, 0);
    deadlineTimer = window.setTimeout(expire, 10 * 60_000);
    return () => {
      controller.abort(); window.clearTimeout(timer); window.clearTimeout(deadlineTimer);
      document.removeEventListener("visibilitychange", onVisibility);
      retryCommand.current = null;
    };
  }, [interviewId, shouldLoad, key, attempt, uploadCompleted, onPolicyError]);

  const refresh = useCallback(() => setAttempt((value) => value + 1), []);
  const retry = useCallback(() => retryCommand.current?.(), []);
  const current = state?.key === key ? state : null;
  const view: FeedbackVideoView = {
    visible: shouldLoad && current?.data?.reasonCode !== "TEXT_INTERVIEW",
    data: shouldLoad ? current?.data ?? null : null,
    notice: shouldLoad ? current?.notice ?? null : null,
    busy: current?.busy ?? true,
    uploadStatus,
  };
  return { view, refresh, retry };
};
