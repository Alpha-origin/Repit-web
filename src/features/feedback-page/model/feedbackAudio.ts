import type { AudioAnalysis } from "../api/getAudioAnalysis";
import type { FeedbackSpeechAnalysis } from "@/widgets/feedback-page/feedback-overall/type";

export const HIDDEN_SPEECH: FeedbackSpeechAnalysis = { visible: false, message: "", canRetry: false };
export const LOADING_SPEECH: FeedbackSpeechAnalysis = { visible: true, message: "음성 분석 정보를 확인하고 있어요.", canRetry: false };

export const buildSpeechAnalysis = (result: AudioAnalysis, answerMode?: "TEXT" | "VOICE" | null): FeedbackSpeechAnalysis => {
  if (answerMode === "TEXT") return HIDDEN_SPEECH;
  if (answerMode !== "VOICE" && result.status !== "PENDING" && result.answers.length === 0) return HIDDEN_SPEECH;
  const messages = {
    PENDING: "음성을 분석 중입니다. 완료되면 자동으로 표시됩니다.",
    READY: "음성 분석이 완료되었습니다. 음성 점수와 코멘트 제공은 준비 중입니다.",
    PARTIAL: "일부 답변의 음성 분석 결과만 있습니다. 음성 점수와 코멘트 제공은 준비 중입니다.",
    UNAVAILABLE: "제공할 수 있는 음성 분석 결과가 없습니다.",
    FAILED: "음성 분석에 실패했습니다.",
  };
  return { visible: true, message: messages[result.status], canRetry: false };
};
