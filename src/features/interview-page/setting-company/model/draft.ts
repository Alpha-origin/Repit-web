import type {
  InterviewDifficultyOption,
  InterviewStyleOption,
} from "@/shared/constants/interview-page/setting-interview";
import type {
  InterviewerPersonality,
  InterviewerSlot,
  InterviewerTone,
} from "@/shared/constants/interview-page/setting-multi-interview";

export const COMPANY_SETTING_PATH = "/main/setting/interview/company";

type AnswerMode = "voice" | "text";

export interface SoloInterviewDraft {
  mode: "SOLO";
  difficulty: InterviewDifficultyOption;
  personality: InterviewerPersonality;
  tone: InterviewerTone;
  interviewerKey: string;
  answerMode: AnswerMode;
}

export interface MultiInterviewDraft {
  mode: "MULTI";
  style: InterviewStyleOption;
  difficulty: InterviewDifficultyOption;
  slots: InterviewerSlot[];
  answerMode: AnswerMode;
}

export type InterviewDraft = SoloInterviewDraft | MultiInterviewDraft;

export type SubmitInterviewResult =
  | { ok: true; path: string; state: unknown }
  | { ok: false; errorMessage: string; requiresMaterials: boolean };

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

// 라우터 state는 주소 직접 입력·새로고침 등으로 비거나 깨질 수 있어 모양만 확인한다.
export const readInterviewDraft = (state: unknown): InterviewDraft | null => {
  if (!isRecord(state) || !isRecord(state.draft)) return null;
  const draft = state.draft;
  if (draft.answerMode !== "voice" && draft.answerMode !== "text") return null;
  if (typeof draft.difficulty !== "string") return null;

  if (draft.mode === "SOLO") {
    return typeof draft.personality === "string" &&
      typeof draft.tone === "string" &&
      typeof draft.interviewerKey === "string"
      ? (draft as unknown as SoloInterviewDraft)
      : null;
  }
  if (draft.mode === "MULTI") {
    return typeof draft.style === "string" &&
      Array.isArray(draft.slots) &&
      draft.slots.length >= 2 &&
      draft.slots.length <= 4 &&
      draft.slots.every(isRecord)
      ? (draft as unknown as MultiInterviewDraft)
      : null;
  }
  return null;
};
