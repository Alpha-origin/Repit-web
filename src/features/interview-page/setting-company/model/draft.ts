import { MULTI_INTERVIEWER_TEMPLATES, type InterviewerCount } from "@/shared/constants/interview-page/setting-multi-interview";
import { validateSelection } from "@/features/interview-page/setting-multi-interview/model/selection";
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

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

export const readInterviewDraft = (state: unknown): InterviewDraft | null => {
  if (!isRecord(state) || !isRecord(state.draft)) return null;
  const draft = state.draft;
  if (draft.answerMode !== "voice" && draft.answerMode !== "text") return null;
  if (!["쉬움", "보통", "어려움"].includes(String(draft.difficulty))) return null;
  const difficulty = draft.difficulty as InterviewDifficultyOption;
  const validPersonality = (value: unknown) => ["FRIENDLY", "REALISTIC", "METICULOUS"].includes(String(value));
  const validTone = (value: unknown) => ["GENTLE", "DIRECT", "PRESSURING"].includes(String(value));
  const findInterviewer = (key: unknown) => MULTI_INTERVIEWER_TEMPLATES.find((item) => item.key === key);
  if (draft.mode === "SOLO") {
    if (!validPersonality(draft.personality) || !validTone(draft.tone) || !findInterviewer(draft.interviewerKey)) return null;
    return { mode: "SOLO", difficulty, answerMode: draft.answerMode,
      personality: draft.personality as InterviewerPersonality, tone: draft.tone as InterviewerTone,
      interviewerKey: String(draft.interviewerKey) };
  }
  if (draft.mode !== "MULTI" || !["편함", "일반", "압박"].includes(String(draft.style)) ||
    !Array.isArray(draft.slots) || draft.slots.length < 2 || draft.slots.length > 4) return null;
  const slots: InterviewerSlot[] = [];
  for (const slot of draft.slots) {
    if (!isRecord(slot) || !isRecord(slot.interviewer) || !validPersonality(slot.personality) || !validTone(slot.tone)) return null;
    const interviewer = findInterviewer(slot.interviewer.key);
    if (!interviewer || !["TECH", "HR", "CEO", "PM", "DESIGN"].includes(String(slot.role))) return null;
    slots.push({ interviewer, role: slot.role as InterviewerSlot["role"],
      personality: slot.personality as InterviewerPersonality, tone: slot.tone as InterviewerTone });
  }
  if (validateSelection(slots, slots.length as InterviewerCount)) return null;
  return { mode: "MULTI", difficulty, style: draft.style as InterviewStyleOption, slots, answerMode: draft.answerMode };
};
