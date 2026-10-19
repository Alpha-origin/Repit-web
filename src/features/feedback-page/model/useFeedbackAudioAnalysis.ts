import { useEffect, useState } from "react";
import { getAudioAnalysis } from "../api/getAudioAnalysis";
import { buildSpeechAnalysis, HIDDEN_SPEECH, LOADING_SPEECH } from "./feedbackAudio";
import type { FeedbackSpeechAnalysis } from "@/widgets/feedback-page/feedback-overall/type";

export const useFeedbackAudioAnalysis = (
  interviewId: number | undefined,
  answerMode: "TEXT" | "VOICE" | null | undefined,
  enabled: boolean,
  onPolicyError?: (error: unknown) => Promise<boolean>,
) => {
  const [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState<{ key: string; view: FeedbackSpeechAnalysis } | null>(null);
  const key = JSON.stringify([interviewId, answerMode ?? null, enabled, attempt]);
  const shouldLoad = enabled && Number.isSafeInteger(interviewId) && (interviewId ?? 0) > 0 && answerMode !== "TEXT";

  useEffect(() => {
    if (!shouldLoad || interviewId === undefined) return;
    const controller = new AbortController();
    const deadline = Date.now() + 5 * 60_000;
    let timer: number;
    const update = (view: FeedbackSpeechAnalysis) => {
      if (!controller.signal.aborted) setResult({ key, view });
    };
    const poll = async () => {
      if (controller.signal.aborted) return;
      if (Date.now() >= deadline) {
        update({ visible: true, message: "음성 분석이 지연되고 있습니다. 잠시 후 다시 확인해주세요.", canRetry: true });
        return;
      }
      try {
        const data = await getAudioAnalysis(interviewId, controller.signal);
        if (controller.signal.aborted) return;
        update(buildSpeechAnalysis(data, answerMode));
        if (data.status === "PENDING") timer = window.setTimeout(() => void poll(), Math.min(5_000, Math.max(0, deadline - Date.now())));
      } catch (error) {
        if (controller.signal.aborted || await onPolicyError?.(error)) return;
        update({ visible: true, message: "음성 분석 정보를 확인하지 못했습니다.", canRetry: true });
      }
    };
    timer = window.setTimeout(() => void poll(), 0);
    return () => { controller.abort(); window.clearTimeout(timer); };
  }, [interviewId, answerMode, key, shouldLoad, onPolicyError]);

  return {
    view: !shouldLoad ? HIDDEN_SPEECH : result?.key === key ? result.view : LOADING_SPEECH,
    retry: () => setAttempt((value) => value + 1),
  };
};
