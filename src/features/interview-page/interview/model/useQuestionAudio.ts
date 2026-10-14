import { useCallback, useEffect, useRef, useState } from "react";
import { getQuestionAudio } from "../api";
import type { QuestionAudioStatus } from "@/widgets/interview-page/interview/type";

const AUDIO_WAIT_MS = 180_000;
const RETRY_DELAYS_MS = [1_000, 2_000, 4_000];
const FAILURE_MESSAGE = "음성 재생에 실패했습니다.";

interface UseQuestionAudioParams {
  sessionId: string | null;
  questionId: number | null;
  enabled: boolean;
  autoplay: boolean;
}

interface AudioOperation {
  key: string;
  controller: AbortController;
  audio: HTMLAudioElement | null;
  status: QuestionAudioStatus;
  wantsPlayback: boolean;
  playAttempt: number;
}

export const useQuestionAudio = ({ sessionId, questionId, enabled, autoplay }: UseQuestionAudioParams) => {
  const [state, setState] = useState<{ key: string | null; status: QuestionAudioStatus }>({ key: null, status: "idle" });
  const operationRef = useRef<AudioOperation | null>(null);
  const autoplayRef = useRef(autoplay);
  const autoPlayedRef = useRef(new Set<string>());
  const suppressedRef = useRef(new Set<string>());
  const key = sessionId !== null && questionId !== null ? `${sessionId}:${questionId}` : null;

  useEffect(() => { autoplayRef.current = autoplay; }, [autoplay]);

  const isCurrent = useCallback((operation: AudioOperation) =>
    operationRef.current === operation && !operation.controller.signal.aborted, []);

  const updateStatus = useCallback((operation: AudioOperation, next: QuestionAudioStatus) => {
    if (!isCurrent(operation)) return;
    operation.status = next;
    setState({ key: operation.key, status: next });
  }, [isCurrent]);

  const play = useCallback(async (operation: AudioOperation) => {
    const audio = operation.audio;
    if (!audio || !isCurrent(operation)) return;
    const attempt = ++operation.playAttempt;
    operation.wantsPlayback = true;
    audio.currentTime = 0;
    updateStatus(operation, "playing");
    try {
      await audio.play();
      if (!isCurrent(operation) || !operation.wantsPlayback) audio.pause();
    } catch (error) {
      if (!isCurrent(operation) || attempt !== operation.playAttempt) return;
      operation.wantsPlayback = false;
      const blocked = error instanceof DOMException && error.name === "NotAllowedError";
      updateStatus(operation, blocked ? "blocked" : "failed");
    }
  }, [isCurrent, updateStatus]);

  useEffect(() => {
    if (!enabled || sessionId === null || questionId === null || key === null) return;
    const controller = new AbortController();
    const operation: AudioOperation = {
      key, controller, audio: null, status: "loading", wantsPlayback: false, playAttempt: 0,
    };
    operationRef.current = operation;
    let retryTimer: number | undefined;
    let releaseRetry: (() => void) | undefined;
    const startedAt = Date.now();
    const fail = () => {
      updateStatus(operation, "failed");
      controller.abort();
      window.clearTimeout(deadline);
      if (retryTimer !== undefined) window.clearTimeout(retryTimer);
      releaseRetry?.();
    };
    const deadline = window.setTimeout(fail, AUDIO_WAIT_MS);
    const run = async () => {
      await Promise.resolve();
      updateStatus(operation, "loading");
      let errorCount = 0;
      while (isCurrent(operation)) {
        if (Date.now() - startedAt >= AUDIO_WAIT_MS) { fail(); return; }
        const result = await getQuestionAudio({ sessionId, questionId, signal: controller.signal });
        if (!isCurrent(operation) || ("aborted" in result)) return;
        if (Date.now() - startedAt >= AUDIO_WAIT_MS) { fail(); return; }
        if ("notFound" in result) {
          window.clearTimeout(deadline);
          updateStatus(operation, "idle");
          return;
        }
        if (!result.data) {
          console.warn("질문 음성 조회 실패", result.errorMessage);
          const delay = RETRY_DELAYS_MS[errorCount++];
          if (delay === undefined) { fail(); return; }
          await new Promise<void>((resolve) => {
            releaseRetry = resolve;
            retryTimer = window.setTimeout(resolve, delay);
          });
          continue;
        }
        const data = result.data;
        if (data.status === "PENDING") { errorCount = 0; continue; }
        window.clearTimeout(deadline);
        if (data.status === "FAILED") {
          console.warn("질문 음성 생성 실패", data.errorCode);
          updateStatus(operation, "failed");
          return;
        }
        const audio = new Audio(data.url!);
        operation.audio = audio;
        audio.onended = () => {
          operation.wantsPlayback = false;
          updateStatus(operation, "idle");
        };
        audio.onerror = () => {
          operation.wantsPlayback = false;
          operation.playAttempt++;
          audio.pause();
          updateStatus(operation, "failed");
        };
        updateStatus(operation, "idle");
        if (autoplayRef.current && !suppressedRef.current.has(key) && !autoPlayedRef.current.has(key)) {
          autoPlayedRef.current.add(key);
          void play(operation);
        }
        return;
      }
    };
    void run();
    return () => {
      controller.abort();
      window.clearTimeout(deadline);
      if (retryTimer !== undefined) window.clearTimeout(retryTimer);
      releaseRetry?.();
      operation.wantsPlayback = false;
      operation.playAttempt++;
      const audio = operation.audio;
      if (audio) {
        audio.pause();
        audio.onended = null;
        audio.onerror = null;
        audio.removeAttribute("src");
        audio.load();
      }
      if (operationRef.current === operation) operationRef.current = null;
    };
  }, [enabled, sessionId, questionId, key, isCurrent, updateStatus, play]);

  const onStop = useCallback(() => {
    if (key === null) return;
    suppressedRef.current.add(key);
    const operation = operationRef.current;
    if (!operation || operation.key !== key || !isCurrent(operation)) return;
    operation.wantsPlayback = false;
    operation.playAttempt++;
    if (operation.audio) {
      operation.audio.pause();
      operation.audio.currentTime = 0;
    }
    if (operation.status === "playing" || operation.status === "blocked") updateStatus(operation, "idle");
  }, [key, isCurrent, updateStatus]);

  const onToggle = useCallback(() => {
    const operation = operationRef.current;
    if (!operation || operation.key !== key || !isCurrent(operation)) return;
    if (operation.status === "loading" || operation.status === "failed") return;
    if (operation.status === "playing") onStop();
    else void play(operation);
  }, [key, isCurrent, onStop, play]);

  const visibleStatus = enabled && key !== null ? (state.key === key ? state.status : "loading") : "idle";
  return {
    status: visibleStatus,
    errorMessage: visibleStatus === "failed" ? FAILURE_MESSAGE : null,
    onToggle,
    onStop,
  };
};
